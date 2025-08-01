import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function DashboardSectionCard({
  totalProjects,
  totalEvents,
  totalMembers
}: Readonly<{
  totalProjects: number;
  totalEvents: number;
  totalMembers: number;
}>) {
  return (
    <section aria-labelledby="section-cards-heading">
      <div className="grid grid-cols-1 gap-6 @xl/main:grid-cols-3 @5xl/main:grid-cols-3">
        <Card>
          <CardHeader className="relative">
            <CardDescription>Dự án</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {totalProjects}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="relative">
            <CardDescription>Sự Kiện</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {totalEvents.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="relative">
            <CardDescription>Thành viên</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {totalMembers}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
}
