import AppSidebar from '@/components/organisms/AppSidebar';
import Map from '@/components/organisms/Map';
import RoadSection from '@/components/organisms/RoadSection';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { useMenuStore } from '@/stores/menuStore';

const Home = () => {
  const { currentMenu } = useMenuStore();

  const renderContent = () => {
    switch (currentMenu) {
      case 'Maps':
        return <Map />;
      case 'Roads':
        return <RoadSection />;
      default:
        return <Map />;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="text-black">
                    {currentMenu}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-col p-4 pt-0">
          <div className="h-screen flex flex-col">
            <div className="flex-1 relative z-0 overflow-hidden rounded-xl">
              {renderContent()}
            </div>
            <Toaster />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;
