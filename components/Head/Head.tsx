import NextHead from "next/head"
import { useRouter } from "next/router"

interface HeadProps {
  title?: string
  description?: string
  keywords?: string
  img?: string
  url?: string
  author?: string
  favicon?: string
  theme?: string
}

const Head = (props: HeadProps) => {
  const { title, description, keywords, img, url, author, favicon, theme } =
    props
  const router = useRouter()
  return (
    <NextHead>
      <link rel="shortcut icon" href={favicon ?? "/favicon.ico"} />
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author ?? "Abiel Zulio M"} />
      <meta property="og:image" content={img ?? "/og.png"} />
      <meta name="og:description" content={description} />
      <meta property="og:title" content={title} />
      <meta
        property="og:url"
        content={url ?? router.basePath + router.asPath}
      />
      <meta property="og:site_name" content={title} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content={theme} />
    </NextHead>
  )
}

export default Head
