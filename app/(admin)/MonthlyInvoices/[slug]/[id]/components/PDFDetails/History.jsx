"use client";
import { fetchMyPdfsOfDoc } from "@/api/firebase/functions/fetch";
import { deleteDocument } from "@/api/firebase/functions/upload";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import emailjs from "emailjs-com";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import formatToSydneyTime from "@/lib/utils/formatToSydneyTime";
import useAdminContext from "@/context/AdminProvider";
import sendInvoice from "@/server/Paypal/createDraftInvoice";
import { Delete, DeleteIcon, Mail, TrashIcon } from "lucide-react";
import { IconBrandPaypal } from "@tabler/icons-react";

export default function History({ email }) {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { allUsers } = useAdminContext();

  useEffect(() => {
    const get = async () => {
      try {
        const pdfs = await fetchMyPdfsOfDoc(email);
        pdfs
          .filter(
            (pdf) => pdf.createdAt && typeof pdf.createdAt.toDate === "function"
          )
          .sort(
            (a, b) =>
              b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
          );
        setPdfs(pdfs);
      } catch (err) {
        console.log(err);

        setError("Failed to fetch PDFs.");
      } finally {
        setLoading(false);
      }
    };
    get();
  }, [email]);

  const deletePdf = async (docId) => {
    try {
      await deleteDocument("generatedPdfs", docId);
      console.log("PDF deleted successfully!");
      setPdfs((prev) => prev.filter((pdf) => pdf.id !== docId));
    } catch (err) {
      console.error("Error deleting PDF:", err);
    }
  };
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async function sendEmailToClients(toEmail, url) {
    alert("Sending pdf to: " + toEmail);

    console.log(toEmail);

    const cleanEmail = toEmail.trim();

    if (!isValidEmail(cleanEmail)) {
      toast.error("Invalid email address.");
      alert("The email address is invalid.");
      return;
    }

    try {
      const templateParams = {
        toEmail: toEmail,
        url: url,
        download: url,
      };

      await emailjs.send(
        "service_i9cmmnr",
        "template_n4vn10i",
        templateParams,
        "vYni03aqa3sHW_yf9"
      );

      console.log("Email sent successfully");
      toast.success(`Email sent to: ${toEmail}`);
      return true;
    } catch (error) {
      console.error("Error while processing data:", error);
      toast("Failed to send the email. Please try again.");
      return null;
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>Email</TableColumn>
        <TableColumn>Issue</TableColumn>
        <TableColumn>Dates</TableColumn>
        <TableColumn>ID</TableColumn>
        <TableColumn>Download</TableColumn>
        <TableColumn>Action</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No rows to display."}>
        {pdfs?.map((pdf, index) => {
          const user = allUsers.find((user) => user?.email === pdf?.email);
          const sendingEmail = user.billingEmail
            ? user?.billingEmail
            : user?.email;

          return (
            <TableRow key={pdf.id}>
              <TableCell>{pdf?.firstName || pdf?.userName}</TableCell>
              <TableCell>{formatToSydneyTime(pdf.createdAt)}</TableCell>
              <TableCell>
                {pdf?.datesRange?.start + "-" + pdf?.datesRange?.end}
              </TableCell>
              <TableCell>{pdf?.pdfId}</TableCell>
              <TableCell>
                <a
                  target="_blank"
                  href={pdf?.url}
                  rel="noopener noreferrer"
                  download
                >
                  View
                </a>
              </TableCell>
              <TableCell>
                <div className="flex flex-row gap-2">
                  <Button
                    size="sm"
                    startContent={<TrashIcon className="size-3" />}
                    onClick={() => deletePdf(pdf?.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    startContent={<Mail className="size-3" />}
                    onClick={() => sendEmailToClients(sendingEmail, pdf?.url)}
                  >
                    Email
                  </Button>
                  <Button
                    size="sm"
                    startContent={<IconBrandPaypal className="size-3" />}
                    onClick={() => sendInvoice(JSON.stringify(pdf))}
                  >
                    Paypal
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
