import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
interface Props {
  children?: React.ReactNode
}
function MainLayoutInner({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Phần content sẽ chiếm không gian còn lại */}
      <main className="flex-1">
        {children}
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
const MainLayout = memo(MainLayoutInner)
export default MainLayout
