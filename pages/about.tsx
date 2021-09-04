import Link from 'next/link'
import Layout from '../components/Layout'

const AboutPage = () => (
  <Layout title="About | Rymador">
    <h1 className="text-2xl text-center m-4">About</h1>
    <p>The service is written in rust and the frontend nextjs. That's all for now folks.</p>
    <p className="mt-5">
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
)

export default AboutPage
