import { PrismaClient, Prisma, Genero, Filme } from '@prisma/client';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando o processo de seeding...');

    // --- 1. Criar Gêneros ---
    console.log('Criando gêneros...');
    const generosData: Prisma.GeneroCreateInput[] = [
        { descricao: 'Ação' }, { descricao: 'Aventura' }, { descricao: 'Comédia' },
        { descricao: 'Drama' }, { descricao: 'Ficção Científica' }, { descricao: 'Terror' },
        { descricao: 'Fantasia' }, { descricao: 'Romance' }, { descricao: 'Suspense' },
        { descricao: 'Animação' }, { descricao: 'Documentário' }, { descricao: 'Musical' },
        { descricao: 'Crime' }, { descricao: 'Mistério' }, { descricao: 'Guerra' },
        { descricao: 'História' }, { descricao: 'Esporte' }, { descricao: 'Faroeste' },
        { descricao: 'Biografia' }, { descricao: 'Família' },
    ];

    const generos: Genero[] = [];
    for (const genero of generosData) {
        let existingGenero = await prisma.genero.findFirst({
            where: { descricao: genero.descricao },
        });

        let createdGenero: Genero;
        if (existingGenero) {
            createdGenero = existingGenero;
            console.log(`Gênero já existe, pulando criação: ${genero.descricao}`);
        } else {
            createdGenero = await prisma.genero.create({
                data: genero,
            });
            console.log(`Gênero criado: ${createdGenero.descricao}`);
        }
        generos.push(createdGenero);
    }


    // --- 2. Criar Usuários ---
    console.log('Criando usuários...');
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // ADICIONANDO MAIS USUÁRIOS AQUI:
    const usersData: Prisma.UsuarioCreateInput[] = [
        { nome: 'Admin Master', apelido: 'Admin', email: 'admin@example.com', senha: hashedPassword, data_nascimento: new Date('1980-01-01T00:00:00Z'), tipoUsuario: 'ADMIN', status: true },
        { nome: 'Usuário Comum 1', apelido: 'User1', email: 'user1@example.com', senha: hashedPassword, data_nascimento: new Date('1990-05-15T00:00:00Z'), tipoUsuario: 'COMUM', status: true },
        { nome: 'Usuário Comum 2', apelido: 'User2', email: 'user2@example.com', senha: hashedPassword, data_nascimento: new Date('1992-08-20T00:00:00Z'), tipoUsuario: 'COMUM', status: true },
        { nome: 'Carlos Silva', apelido: 'Carlinhos', email: 'carlos@example.com', senha: hashedPassword, data_nascimento: new Date('1988-11-01T00:00:00Z'), tipoUsuario: 'COMUM', status: true },
        { nome: 'Ana Costa', apelido: 'Aninha', email: 'ana@example.com', senha: hashedPassword, data_nascimento: new Date('1995-03-25T00:00:00Z'), tipoUsuario: 'COMUM', status: true },
        { nome: 'Beatriz Lima', apelido: 'Bia', email: 'bia@example.com', senha: hashedPassword, data_nascimento: new Date('1987-07-07T00:00:00Z'), tipoUsuario: 'COMUM', status: true },
    ];

    const usuarios = [];
    for (const user of usersData) {
        const createdUser = await prisma.usuario.upsert({
            where: { email: user.email },
            update: { senha: user.senha },
            create: user,
        });
        usuarios.push(createdUser);
        console.log(`Usuário criado: ${createdUser.email} (${createdUser.tipoUsuario})`);
    }

    // --- 3. Criar Filmes ---
    console.log('Criando filmes...');

    const filmesData: (Omit<Prisma.FilmeCreateInput, 'generos'> & { generoDescriptions?: string[] })[] = [
        {
            nome: 'O Poderoso Chefão',
            anoLancamento: 1972,
            duracao: 175,
            diretor: 'Francis Ford Coppola',
            produtora: 'Paramount Pictures',
            classificacao: '14',
            poster: "https://br.web.img3.acsta.net/medias/nmedia/18/90/93/20/20120876.jpg",
            generoDescriptions: ['Crime', 'Drama'],
        },
        {
            nome: 'A Origem',
            anoLancamento: 2010,
            duracao: 148,
            diretor: 'Christopher Nolan',
            produtora: 'Warner Bros.',
            classificacao: '12',
            poster: "https://musicart.xboxlive.com/7/e63b1100-0000-0000-0000-000000000002/504/image.jpg",
            generoDescriptions: ['Ação', 'Aventura', 'Ficção Científica', 'Suspense'],
        },
        {
            nome: 'Interestelar',
            anoLancamento: 2014,
            duracao: 169,
            diretor: 'Christopher Nolan',
            produtora: 'Paramount Pictures',
            classificacao: '10',
            poster: "https://acdn-us.mitiendanube.com/stores/004/687/740/products/pos-01875-85bc65a11d5aeb4efe17181254764753-480-0.jpg",
            generoDescriptions: ['Aventura', 'Drama', 'Ficção Científica'],
        },
        {
            nome: 'Forrest Gump: O Contador de Histórias',
            anoLancamento: 1994,
            duracao: 142,
            diretor: 'Robert Zemeckis',
            produtora: 'Paramount Pictures',
            classificacao: 'Livre',
            poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgURuvnsrhBAF2Ow0G8fFYfj_B1kaEpapd9A&s",
            generoDescriptions: ['Comédia', 'Drama', 'Romance'],
        },
        {
            nome: 'Pulp Fiction: Tempo de Violência',
            anoLancamento: 1994,
            duracao: 154,
            diretor: 'Quentin Tarantino',
            produtora: 'Miramax Films',
            classificacao: '18',
            poster: "https://image.tmdb.org/t/p/original/tptjnB2LDbuUWya9Cx5sQtv5hqb.jpg",
            generoDescriptions: ['Crime', 'Drama', 'Suspense'],
        },
        {
            nome: 'O Senhor dos Anéis: A Sociedade do Anel',
            anoLancamento: 2001,
            duracao: 178,
            diretor: 'Peter Jackson',
            produtora: 'New Line Cinema',
            classificacao: '12',
            poster: "https://img.elo7.com.br/product/zoom/269274A/poster-o-senhor-dos-aneis-a-sociedade-do-anel-lo04-90x60-cm-presente-geek.jpg",
            generoDescriptions: ['Aventura', 'Fantasia', 'Drama'],
        },
        {
            nome: 'A Viagem de Chihiro',
            anoLancamento: 2001,
            duracao: 125,
            diretor: 'Hayao Miyazaki',
            produtora: 'Studio Ghibli',
            classificacao: 'Livre',
            poster: "https://a-static.mlcdn.com.br/1500x1500/poster-cartaz-a-viagem-de-chihiro-a-pop-arte-poster/poparteskins2/pos-03517-30x45cm/ee84f4bbde19c486621850eef011b3d3.jpeg",
            generoDescriptions: ['Animação', 'Aventura', 'Fantasia'],
        },
        {
            nome: 'Parasita',
            anoLancamento: 2019,
            duracao: 132,
            diretor: 'Bong Joon-ho',
            produtora: 'Barunson E&A',
            classificacao: '16',
            poster: "https://a-static.mlcdn.com.br/1500x1500/poster-cartaz-parasita-a-pop-arte-poster/poparteskins2/15938535960/e61f97ef36c4ed5cb8c2268fdb15fda6.jpeg",
            generoDescriptions: ['Comédia', 'Drama', 'Suspense'],
        },
        {
            nome: 'O Resgate do Soldado Ryan',
            anoLancamento: 1998,
            duracao: 169,
            diretor: 'Steven Spielberg',
            produtora: 'DreamWorks Pictures',
            classificacao: '16',
            poster: "https://a-static.mlcdn.com.br/1500x1500/poster-cartaz-o-resgate-do-soldado-ryan-c-pop-arte-poster/poparteskins2/15938515318/7af3b53bf9bae6fefe027ed38903cdaa.jpeg",
            generoDescriptions: ['Drama', 'Guerra'],
        },
        {
            nome: 'Capitão América 2: O Soldado Invernal',
            anoLancamento: 2014,
            duracao: 136,
            diretor: 'Anthony Russo, Joe Russo',
            produtora: 'Marvel Studios',
            classificacao: '12',
            poster: "https://cdn.awsli.com.br/2500x2500/1610/1610163/produto/177684697/poster-capitao-america-2-o-soldado-invernal-ed340cd0.jpg",
            generoDescriptions: ['Ação', 'Aventura', 'Ficção Científica'],
        },
        {
            nome: 'A Chegada',
            anoLancamento: 2016,
            duracao: 116,
            diretor: 'Denis Villeneuve',
            produtora: 'Paramount Pictures',
            classificacao: '10',
            poster: "https://br.web.img3.acsta.net/pictures/16/10/19/01/57/552532.jpg",
            generoDescriptions: ['Drama', 'Mistério', 'Ficção Científica'],
        },
        {
            nome: 'Senhor dos Anéis: O Retorno do Rei',
            anoLancamento: 2003,
            duracao: 201,
            diretor: 'Peter Jackson',
            produtora: 'New Line Cinema',
            classificacao: '12',
            poster: "https://img.elo7.com.br/product/zoom/2692949/big-poster-o-senhor-dos-aneis-o-retorno-do-rei-lo09-90x60-cm-o-senhor-dos-aneis-o-retorno-do-rei.jpg",
            generoDescriptions: ['Aventura', 'Fantasia', 'Drama'],
        },
        {
            nome: 'Whiplash: Em Busca da Perfeição',
            anoLancamento: 2014,
            duracao: 106,
            diretor: 'Damien Chazelle',
            produtora: 'Bold Films',
            classificacao: '12',
            poster: "https://m.media-amazon.com/images/I/61tWmSwoDeL.jpg",
            generoDescriptions: ['Drama', 'Musical'],
        },
        {
            nome: 'Clube da Luta',
            anoLancamento: 1999,
            duracao: 139,
            diretor: 'David Fincher',
            produtora: '20th Century Fox',
            classificacao: '18',
            poster: "https://br.web.img3.acsta.net/medias/nmedia/18/90/95/96/20122166.jpg",
            generoDescriptions: ['Drama'],
        },
        {
            nome: 'O Iluminado',
            anoLancamento: 1980,
            duracao: 146,
            diretor: 'Stanley Kubrick',
            produtora: 'Warner Bros.',
            classificacao: '16',
            poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReS5Od6ststjILRf7itNPxZF1TWcLW7knRnQ&s",
            generoDescriptions: ['Terror', 'Drama'],
        },
        {
            nome: 'Your Name.',
            anoLancamento: 2016,
            duracao: 106,
            diretor: 'Makoto Shinkai',
            produtora: 'CoMix Wave Films',
            classificacao: 'Livre',
            poster: "https://uauposters.com.br/media/catalog/product/9/1/916820211216-uau-posters-your-name-animes-2.jpg",
            generoDescriptions: ['Animação', 'Drama', 'Fantasia', 'Romance'],
        },
        {
            nome: 'Toy Story',
            anoLancamento: 1995,
            duracao: 81,
            diretor: 'John Lasseter',
            produtora: 'Pixar Animation Studios',
            classificacao: 'Livre',
            poster: "https://m.media-amazon.com/images/I/71N8Kav4AtL._UF1000,1000_QL80_.jpg",
            generoDescriptions: ['Animação', 'Aventura', 'Comédia', 'Família']
        },
        {
            nome: 'Batman: O Cavaleiro das Trevas',
            anoLancamento: 2008,
            duracao: 152,
            diretor: 'Christopher Nolan',
            produtora: 'Warner Bros.',
            classificacao: '12',
            poster: "https://img.elo7.com.br/product/main/264FCC6/big-poster-filme-batman-o-cavaleiro-das-trevas-lo02-90x60-cm-batman.jpg",
            generoDescriptions: ['Ação', 'Crime', 'Drama', 'Suspense'],
        },
    ];

    // Busque todos os filmes para garantir que temos todos os IDs para as avaliações
    const todosOsFilmesDoDB = await prisma.filme.findMany();


    for (const filmeData of filmesData) {
        const { generoDescriptions, ...filmeScalarData } = filmeData;

        let existingFilme = await prisma.filme.findFirst({
            where: { nome: filmeScalarData.nome },
        });

        let createdFilme: Filme;
        if (existingFilme) {
            createdFilme = await prisma.filme.update({
                where: { id: existingFilme.id },
                data: filmeScalarData,
            });
            console.log(`Filme atualizado: ${createdFilme.nome}`);
        } else {
            createdFilme = await prisma.filme.create({
                data: filmeScalarData,
            });
            console.log(`Filme criado: ${createdFilme.nome}`);
        }

        if (generoDescriptions && generoDescriptions.length > 0) {
            const idsGeneros = generos
                .filter(g => generoDescriptions.includes(g.descricao))
                .map(g => g.id);

            if (idsGeneros.length > 0) {
                await prisma.genero_filme.deleteMany({
                    where: { idFilme: createdFilme.id },
                });

                await prisma.genero_filme.createMany({
                    data: idsGeneros.map(idGenero => ({
                        idFilme: createdFilme.id,
                        idGenero: idGenero,
                    })),
                    skipDuplicates: true,
                });
                console.log(`  Associados ${idsGeneros.length} gêneros ao filme ${createdFilme.nome}`);
            } else {
                await prisma.genero_filme.deleteMany({
                    where: { idFilme: createdFilme.id },
                });
                console.log(`  Removidos todos os gêneros do filme ${createdFilme.nome}`);
            }
        } else {
            await prisma.genero_filme.deleteMany({
                where: { idFilme: createdFilme.id },
            });
            console.log(`  Removidos todos os gêneros do filme ${createdFilme.nome} (nenhum especificado no seed).`);
        }
    }

    // --- 4. Criar Avaliações ---
    console.log('Criando avaliações...');
    const user1 = usuarios.find(u => u.email === 'user1@example.com');
    const user2 = usuarios.find(u => u.email === 'user2@example.com');
    const adminUser = usuarios.find(u => u.email === 'admin@example.com');
    // Novos usuários adicionados
    const carlosUser = usuarios.find(u => u.email === 'carlos@example.com');
    const anaUser = usuarios.find(u => u.email === 'ana@example.com');
    const biaUser = usuarios.find(u => u.email === 'bia@example.com');


    // Busque os filmes reais do DB após eles terem sido criados/atualizados no seed
    const matrix = todosOsFilmesDoDB.find(f => f.nome === 'Matrix');
    const iluminado = todosOsFilmesDoDB.find(f => f.nome === 'O Iluminado');
    const toyStory = todosOsFilmesDoDB.find(f => f.nome === 'Toy Story');
    const vingadores = todosOsFilmesDoDB.find(f => f.nome === 'Vingadores: Ultimato');
    const interestelar = todosOsFilmesDoDB.find(f => f.nome === 'Interestelar');
    const clubeDaLuta = todosOsFilmesDoDB.find(f => f.nome === 'Clube da Luta');
    const aChegada = todosOsFilmesDoDB.find(f => f.nome === 'A Chegada');
    const parasita = todosOsFilmesDoDB.find(f => f.nome === 'Parasita');
    const yourName = todosOsFilmesDoDB.find(f => f.nome === 'Your Name.');


    // Avaliações existentes
    const avaliacoesParaCriar = [];

    if (user1 && matrix) {
        avaliacoesParaCriar.push({ idUsuario: user1.id, idFilme: matrix.id, nota: 5, comentario: 'Filme revolucionário!' });
    }
    if (user2 && iluminado) {
        avaliacoesParaCriar.push({ idUsuario: user2.id, idFilme: iluminado.id, nota: 4, comentario: 'Um clássico do terror psicológico.' });
    }
    if (user1 && toyStory) {
        avaliacoesParaCriar.push({ idUsuario: user1.id, idFilme: toyStory.id, nota: 5, comentario: 'Animação perfeita para todas as idades.' });
    }
    if (adminUser && vingadores) {
        avaliacoesParaCriar.push({ idUsuario: adminUser.id, idFilme: vingadores.id, nota: 4.5, comentario: 'Fechamento épico para a saga.' });
    }

    // --- Novas avaliações para os usuários adicionais ---
    if (carlosUser && interestelar) {
        avaliacoesParaCriar.push({ idUsuario: carlosUser.id, idFilme: interestelar.id, nota: 4.8, comentario: 'Mente explodida! Um épico da ficção científica.' });
    }
    if (anaUser && clubeDaLuta) {
        avaliacoesParaCriar.push({ idUsuario: anaUser.id, idFilme: clubeDaLuta.id, nota: 4.2, comentario: 'Filme intrigante e com final surpreendente.' });
    }
    if (biaUser && aChegada) {
        avaliacoesParaCriar.push({ idUsuario: biaUser.id, idFilme: aChegada.id, nota: 4.7, comentario: 'Uma abordagem única e emocionante de ficção científica.' });
    }
    if (carlosUser && parasita) {
        avaliacoesParaCriar.push({ idUsuario: carlosUser.id, idFilme: parasita.id, nota: 4.9, comentario: 'Obra-prima, cheio de reviravoltas e crítica social.' });
    }
    if (anaUser && yourName) {
        avaliacoesParaCriar.push({ idUsuario: anaUser.id, idFilme: yourName.id, nota: 4.5, comentario: 'Animação linda e história tocante.' });
    }
    if (user2 && vingadores) {
        avaliacoesParaCriar.push({ idUsuario: user2.id, idFilme: vingadores.id, nota: 4.0, comentario: 'Gostei muito, mas achei um pouco longo.' });
    }


    for (const avaliacaoData of avaliacoesParaCriar) {
        await prisma.avaliacao.upsert({
            where: { idUsuario_idFilme: { idUsuario: avaliacaoData.idUsuario, idFilme: avaliacaoData.idFilme } },
            update: { nota: avaliacaoData.nota, comentario: avaliacaoData.comentario },
            create: avaliacaoData,
        });
        // console.log(`Avaliação de ${avaliacaoData.idUsuario} para ${avaliacaoData.idFilme}`); // Log mais genérico
    }
    console.log(`Criadas ${avaliacoesParaCriar.length} avaliações.`);


    console.log('Seeding concluído!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });