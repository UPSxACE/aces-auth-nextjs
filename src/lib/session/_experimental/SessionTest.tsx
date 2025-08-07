import getSession from "./getSession";

export default async function SessionTest() {
	console.log("Render session test");

	const session = await getSession();

	if (!session) return null;

	session.counter += 1;

	const text = `User of id ${session.id}, has role ${session.role} and the session object has been accessed ${session.counter} times!`;

	return <p>{text}</p>;
}
