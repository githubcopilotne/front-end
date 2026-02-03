import Header from './components/common/Header'
import Footer from './components/common/Footer'
import HomePage from './pages/HomePage'

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow">
        <HomePage />
      </main>

      <Footer />
    </div>
  )
}

export default App