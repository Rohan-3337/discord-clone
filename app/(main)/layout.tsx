import ErrorBoundary from "@/components/ErrorBoundary";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar"

const MainLayout = async({children}:{children:React.ReactNode})=>{
    return(
        <ErrorBoundary>

        <div className="h-full">
            <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar/>
            </div>
            <main className="md:pl-[72px] h-full">

            {children}
            </main>
        </div>
        </ErrorBoundary>
    )
}

export default MainLayout;