import React from "react"
import SEO from "../components/seo"
import Layout from "../components/templates/layout"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: No encontrado" />
    <h1>NO ENCONTRADO</h1>
    <p>La página que buscas no existe.</p>
  </Layout>
)

export default NotFoundPage
