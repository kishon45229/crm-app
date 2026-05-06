import Dashboard from "./Dashboard";

export default async function DashboardPage({
    params,
}: {
    params: Promise<{ userId: string }>;
}) {
    const { userId } = await params;
    return <Dashboard userId={userId} />;
}
