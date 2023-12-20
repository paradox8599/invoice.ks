import { keystoneContext } from "@/keystone/context";
import { Button } from "@nextui-org/button";

export default async function Home() {
  const data = await keystoneContext.query.User.count();
  return (
    <>
      <Button>NextUI Button</Button>
      <p>users: {JSON.stringify(data)}</p>
    </>
  );
}
