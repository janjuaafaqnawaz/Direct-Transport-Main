"use client";
import { useEffect, useState } from "react";

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
import toast from "react-hot-toast";
import formatToSydneyTime from "@/lib/utils/formatToSydneyTime";
import useAdminContext from "@/context/AdminProvider";
import { getInvoice } from "@/server/Paypal/api";
import { FolderOpen, Mail, TrashIcon } from "lucide-react";
import { IconBrandPaypal } from "@tabler/icons-react";
import { fetchMyPdfsOfDoc } from "@/api/firebase/functions/fetch";
import { deleteDocument, updateDoc } from "@/api/firebase/functions/upload";
import sendInvoice from "@/server/Paypal/sendInvoice";

export default function History({ email }) {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { allUsers } = useAdminContext();

  useEffect(() => {
    fetchPdfs();
  }, []);

  const fetchPdfs = async () => {
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

  const handleDeletePdf = async (docId) => {
    try {
      await deleteDocument("generatedPdfs", docId);
      setPdfs((prev) => prev.filter((pdf) => pdf.id !== docId));
      toast.success("PDF deleted successfully!");
    } catch (err) {
      console.error("Error deleting PDF:", err);
      toast.error("Failed to delete PDF.");
    }
  };

  const handleSendEmail = async (toEmail, url) => {
    const cleanEmail = toEmail.trim();

    try {
      await emailjs.send(
        "service_i9cmmnr",
        "template_n4vn10i",
        {
          toEmail: cleanEmail,
          url: url,
          download: url,
        },
        "vYni03aqa3sHW_yf9"
      );

      toast.success(`Email sent to: ${cleanEmail}`);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send the email. Please try again.");
    }
  };

  const handlePayPalInvoice = async (pdf) => {
    const { finalDriverPay, pdfId, firstName, docId } = pdf;
    const toastId = toast.loading("Checking details...");
    const user = allUsers.find((user) => user?.email === pdf?.email);
    const sendingEmail = user?.billingEmail || user?.email;
    const cleanEmail = sendingEmail.trim();

    if (!finalDriverPay || !pdfId || !firstName) {
      toast.error(
        "Invalid invoice data. Please retry creating a new invoice.",
        { id: toastId }
      );
      return;
    }

    try {
      const response = await sendInvoice(finalDriverPay, pdfId, firstName);

      if (!response.success) {
        const errorMessage =
          response.error?.details?.[0]?.issue === "DUPLICATE_INVOICE_NUMBER"
            ? "This invoice is already created."
            : response.error?.details?.[0]?.issue || "An error occurred.";
        toast.error(errorMessage, { id: toastId });
        return;
      }

      console.log({ response });

      await updateDoc("generatedPdfs", docId, {
        paypal_id: response.invoiceId,
        paypal_link: response.data.href,
      });

      await emailjs.send(
        "service_i9cmmnr",
        "template_txk0pyh",
        {
          driver_email: cleanEmail,
          driver_name: firstName,
          paypal_link: response.data.href,
          firstName,
          finalDriverPay,
        },
        "vYni03aqa3sHW_yf9"
      );
      fetchPdfs();
      toast.success(response.message, { id: toastId });
    } catch (error) {
      console.error("Error handling PayPal:", error);
      toast.error("Failed to process PayPal invoice.");
    }
  };

  const handleGetInvoiceStatus = async (pdf) => {
    const { paypal_id } = pdf;

    if (!paypal_id) {
      toast.error("Failed to process PayPal invoice.");
      return;
    }

    const toastId = toast.loading("Getting Status...");

    try {
      const details = await getInvoice(paypal_id);
      console.log({ details });

      let statusMessage = details.status;

      if (details.status === "SENT") {
        const dueDate = new Date(details.detail.payment_term.due_date);
        const today = new Date();

        if (details.due_amount.value > 0) {
          if (today > dueDate) {
            statusMessage = "UNPAID";
          } else {
            statusMessage = "DUE";
          }
        } else {
          statusMessage = "PAID";
        }
      }

      toast.success(`Invoice Status: ${statusMessage}`, { id: toastId });
    } catch (error) {
      console.error("Error fetching invoice status:", error);
      toast.error("Failed to fetch invoice status.", { id: toastId });
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
          const sendingEmail = user?.billingEmail || user?.email;

          return (
            <TableRow key={pdf.id}>
              <TableCell>{pdf?.firstName || pdf?.userName}</TableCell>
              <TableCell>{formatToSydneyTime(pdf.createdAt)}</TableCell>
              <TableCell>{`${pdf?.datesRange?.start} - ${pdf?.datesRange?.end}`}</TableCell>
              <TableCell>
                <Chip size="sm">{pdf?.pdfId}</Chip>
                {pdf?.paypal_id && <Chip size="sm">{pdf?.paypal_id}</Chip>}
              </TableCell>
              <TableCell>
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
                    onClick={() => handleDeletePdf(pdf?.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    startContent={<Mail className="size-3" />}
                    onClick={() => handleSendEmail(sendingEmail, pdf?.url)}
                  >
                    Email
                  </Button>
                  <Button
                    startContent={<IconBrandPaypal className="size-3" />}
                    onClick={() => handlePayPalInvoice(pdf)}
                    color="primary"
                  >
                    PayPal
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => handleGetInvoiceStatus(pdf)}
                  >
                    Status
                  </Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
