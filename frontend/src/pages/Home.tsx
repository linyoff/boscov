import Button from "../components/CustomButton";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { LogoPrimary } from "../components/Logo";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-primary text-primary">
      <Header/>

      <div className="flex-1 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
        <LogoPrimary size={160} />

        <h1 className="text-4xl font-bold">Bem-vindo ao Boscov!</h1>
        <p className="text-secondary text-lg">
          Avalie filmes, compartilhe opiniões e descubra o que assistir.
        </p>

        <div className="flex gap-4 flex-wrap justify-center mt-6">
          <Button className="w-44">Ver Filmes</Button>
          <Button className="w-44">Minhas Avaliações</Button>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
