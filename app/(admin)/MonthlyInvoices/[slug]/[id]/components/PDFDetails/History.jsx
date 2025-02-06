"use client";
import { fetchMyPdfsOfDoc } from "@/api/firebase/functions/fetch";
import { deleteDocument, updateDoc } from "@/api/firebase/functions/upload";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  ButtonGroup,
  Chip,
} from "@nextui-org/react";
import emailjs from "emailjs-com";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import formatToSydneyTime from "@/lib/utils/formatToSydneyTime";
import useAdminContext from "@/context/AdminProvider";
import sendPayout from "@/server/Paypal/sendPayout";
import { FolderOpen, Mail, TrashIcon, View } from "lucide-react";
import { IconBrandPaypal } from "@tabler/icons-react";
import { getPayout } from "@/server/Paypal/api";

export default function History({ email }) {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { allUsers } = useAdminContext();

  const getPdfs = async () => {
    try {
      const pdfs = await fetchMyPdfsOfDoc(email);
      const sortedPdfs = pdfs
        .filter(
          (pdf) => pdf.createdAt && typeof pdf.createdAt.toDate === "function"
        )
        .sort(
          (a, b) =>
            b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
        );
      setPdfs(sortedPdfs);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch PDFs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPdfs();
  }, []);

  const deletePdf = async (docId) => {
    try {
      await deleteDocument("generatedPdfs", docId);
      setPdfs((prev) => prev.filter((pdf) => pdf.id !== docId));
      toast.success("PDF deleted successfully!");
    } catch (err) {
      console.error("Error deleting PDF:", err);
      toast.error("Failed to delete PDF.");
    }
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const sendEmailToClients = async (toEmail, url) => {
    const cleanEmail = toEmail.trim();

    if (!isValidEmail(cleanEmail)) {
      toast.error("Invalid email address.");
      return;
    }

    try {
      const templateParams = {
        toEmail: cleanEmail,
        url: url,
        download: url,
      };

      await emailjs.send(
        "service_i9cmmnr",
        "template_n4vn10i",
        templateParams,
        "vYni03aqa3sHW_yf9"
      );

      toast.success(`Email sent to: ${cleanEmail}`);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send the email. Please try again.");
    }
  };

  const handlePayPalPayout = async (pdf) => {
    const { finalDriverPay, pdfId, firstName, docId, email } = pdf;

    const toastId = toast.loading("Checking details...");

    const user = allUsers.find((user) => user?.email === email);
    const payPalEmail = user.payPalEmail;

    // Validate required fields
    if (!finalDriverPay || !pdfId || !firstName || !email || !payPalEmail) {
      toast.error(
        "Invalid invoice data. Please retry creating a new invoice.",
        {
          id: toastId,
        }
      );
      return;
    }

    if (pdf.batch_status === "SUCCESS") {
      toast.error("This payout has already been completed.", { id: toastId });
      return;
    }
    if (pdf.batch_status === "PENDING") {
      toast.error("This payout is already being processed.", { id: toastId });
      return;
    }

    toast.loading("Sending to PayPal...", { id: toastId });

    try {
      // Send payout using the sendPayout function
      const response = await sendPayout(
        finalDriverPay,
        pdfId,
        firstName,
        payPalEmail
      );

      // Check if the payout was successful
      if (!response.success) {
        // Handle specific PayPal errors
        if (
          response.error?.details?.[0]?.issue === "DUPLICATE_INVOICE_NUMBER"
        ) {
          toast.error("This invoice is already created.", { id: toastId });
        } else {
          toast.error(
            response.error?.details?.[0]?.issue || "An error occurred.",
            { id: toastId }
          );
        }
        return;
      }

      console.log({ response });

      await updateDoc("generatedPdfs", docId, {
        paypal_id: response.data.batch_header.payout_batch_id,
        batch_status: response.data.batch_header.batch_status,
        sender_batch_id:
          response.data.batch_header.sender_batch_header.sender_batch_id,
        payout_details: {
          email_subject:
            response.data.batch_header.sender_batch_header.email_subject,
          email_message:
            response.data.batch_header.sender_batch_header.email_message,
          links: response.data.links,
        },
        timestamp: new Date().toISOString(),
      });

      // Refresh the list of PDFs
      getPdfs();

      // Show success message
      toast.success(response.message, { id: toastId });
    } catch (error) {
      console.error("Error handling PayPal payout:", error);
      toast.error("Failed to process PayPal payout.", { id: toastId });
    }
  };

  const getInvoiceStatus = async (pdf) => {
    const { paypal_id, docId } = pdf;

    if (!paypal_id) {
      toast.error("No PayPal transaction found.");
      return;
    }

    const toastId = toast.loading("Getting Status...");

    try {
      const details = await getPayout(paypal_id);
      console.log({ details });

      if (
        !details ||
        !details.batch_header ||
        !details.batch_header.batch_status
      ) {
        throw new Error("Invalid payout details received from PayPal.");
      }

      await updateDoc("generatedPdfs", docId, {
        batch_status: details.batch_header.batch_status,
        last_status_check: new Date().toISOString(),
      });

      getPdfs();

      toast.success(`Invoice Status: ${details.batch_header.batch_status}`, {
        id: toastId,
        duration: 4000,
      });
    } catch (error) {
      console.error("Error fetching invoice status:", error);

      toast.error(
        error.response?.data?.message || "Failed to fetch invoice status.",
        { id: toastId }
      );
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <Table aria-label="PDF History Table">
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Created At</TableColumn>
        <TableColumn>Date Range</TableColumn>
        <TableColumn>PDF ID</TableColumn>
        <TableColumn>Action</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No rows to display."}>
        {pdfs.map((pdf) => {
          const user = allUsers.find((user) => user?.email === pdf?.email);
          const sendingEmail = user?.billingEmail
            ? user.billingEmail
            : user?.email;

          return (
            <TableRow key={pdf.id}>
              <TableCell>{pdf?.firstName || pdf?.userName}</TableCell>
              <TableCell>{formatToSydneyTime(pdf.createdAt)}</TableCell>
              <TableCell>
                {pdf?.datesRange?.start + " - " + pdf?.datesRange?.end}
              </TableCell>
              <TableCell>
                <Chip size="sm">{pdf?.pdfId}</Chip>
                <br />
                {pdf?.paypal_id && (
                  <div className="mt-1">
                    <Chip size="sm">{pdf.paypal_id}</Chip>
                  </div>
                )}
              </TableCell>

              <TableCell>
                <div className="flex flex-row gap-2">
                  <ButtonGroup size="sm">
                    <Button startContent={<FolderOpen className="size-3" />}>
                      <a
                        href={pdf?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        View
                      </a>
                    </Button>
                    <Button
                      startContent={<TrashIcon className="size-3" />}
                      onClick={() => deletePdf(pdf?.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      startContent={<Mail className="size-3" />}
                      onClick={() => sendEmailToClients(sendingEmail, pdf?.url)}
                    >
                      Email
                    </Button>
                    <Button
                      startContent={<IconBrandPaypal className="size-3" />}
                      onClick={() => handlePayPalPayout(pdf)}
                      color="primary"
                      isDisabled={pdf.batch_status}
                    >
                      {pdf.batch_status ? "Paid" : "Payout"}
                    </Button>
                    <Button
                      color="primary"
                      onPress={() => getInvoiceStatus(pdf)}
                    >
                      Status
                    </Button>
                  </ButtonGroup>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
