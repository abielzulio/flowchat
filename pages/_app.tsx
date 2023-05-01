import type { AppProps } from "next/app"
import { ReactFlowProvider } from "reactflow"
import "../styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReactFlowProvider>
      <Component {...pageProps} />
    </ReactFlowProvider>
  )
}
