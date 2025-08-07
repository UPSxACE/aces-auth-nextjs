import Link from "next/link";
import SessionTest from "@/lib/session/_experimental/SessionTest";

export default function Test() {
	return (
		<>
			<h1>test</h1>
			<Link href="/test/sub">Go sub</Link>
			<SessionTest />
			<SessionTest />
			<SessionTest />
			<SessionTest />
			<SessionTest />
		</>
	);
}
