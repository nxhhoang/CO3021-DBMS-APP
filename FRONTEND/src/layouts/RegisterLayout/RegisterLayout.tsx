import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer'
// import RegisterHeader from '../../components/RegisterHeader'
import Header from '../../components/Header'

interface Props {
  children?: React.ReactNode
}
function RegisterLayoutInner({ children }: Props) {
  return (
    <div>
      <Header />
      {children}
      <Outlet />
      <Footer />
    </div>
  )
}

const RegisterLayout = memo(RegisterLayoutInner)

export default RegisterLayout
