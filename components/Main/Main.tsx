const Main = ({ children }: { children: React.ReactNode }) => (
  <main className="w-screen bg-white text-black sm:px-[24px]">
    <section className="sm:max-w-[500px] relative h-screen-safe m-auto sm:border-[1px] overflow-hidden sm:border-[#ebebeb] sm:shadow-lg bg-white sm:rounded-xl flex flex-col">
      {children}
    </section>
  </main>
)

export default Main
