import Image from "next/image";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react"
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import ClientDashboardComponent from "@/components/user/ClientDashboardComponent";
export default async function Home() {
  // const session = await getServerSession(options)
  // if (!session) {
  //   console.log('SESSION FAILED')
  //   redirect("/api/auth/signin?callbackUrl=/")
  // }
  return (
    <ClientDashboardComponent />
  );
}
