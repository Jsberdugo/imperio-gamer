const newsData = [
  {
    id: 1,
    title: 'Noticia #1',
    description: 'Esta es la descripción de la primera noticia. Aquí puedes agregar detalles importantes sobre los eventos o actualizaciones más recientes.',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400',
    date: new Date('2024-12-09T14:30:00'),
  },
  {
    id: 2,
    title: 'Noticia #2',
    description: 'Esta es la descripción de la segunda noticia. Mantente informado sobre las últimas tendencias y novedades del mundo gamer.',
    image: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=400',
    date: new Date('2024-12-08T10:15:00'),
  },
  {
    id: 3,
    title: 'Noticia #3',
    description: 'Esta es la descripción de la tercera noticia. Descubre las promociones especiales y ofertas exclusivas que tenemos para ti.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
    date: new Date('2024-12-07T16:45:00'),
  }
];

export function NewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-primary">Noticias</h1>
        <p className="mt-2 text-muted-foreground">Las últimas novedades y actualizaciones</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsData.map((news) => (
          <article
            key={news.id}
            className="overflow-hidden border-2 border-border bg-card transition-all hover:border-primary"
            style={{
              boxShadow: '0 0 0 rgba(0, 255, 255, 0)',
              transition: 'box-shadow 0.3s ease, border-color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 rgba(0, 255, 255, 0)';
            }}
          >
            <div className="h-48 overflow-hidden bg-secondary">
              <img
                src={news.image}
                alt={news.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h2 className="mb-3 text-primary">{news.title}</h2>
              <p className="text-muted-foreground mb-3">{news.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{news.date.toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>•</span>
                <span>{news.date.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}