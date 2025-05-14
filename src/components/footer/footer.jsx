import "./footer.css";

const Footer = () => {
  const creators = [
    {
      id: 1,
      name: "Anna Melnychenko",
      url: "https://github.com/annamelya2021",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <button className="scroll-to-top" onClick={scrollToTop}>
        <i className="fas fa-arrow-up"></i>
      </button>
      <div className="creators">
        {creators.map((creator) => (
          <a
            key={creator.id}
            href={creator.url}
            target="_blank"
            rel="noopener noreferrer"
            className="creator-link"
          >
            <div className="creator">
              <span className="creator-name">{creator.name}</span>
            </div>
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
