
import { checkUser } from "@/lib/checkUser";
import HeaderClient from "@/components/headerClient";
import {checkAndAllocateCredits} from "@/actions/credits"

export default async function HeaderServer() {
  const serverUser = await checkUser(); // DB user with role

  if(serverUser?.role == "PATIENT"){
  await checkAndAllocateCredits(serverUser);
  }
  return <HeaderClient serverUser={serverUser} />;
}
