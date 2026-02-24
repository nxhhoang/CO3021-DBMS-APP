function Home() {
  const handleClick = () => {
    alert("Welcome to Home page!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Home Page</h1>
      <p>Chào mừng bạn đến với trang chủ 🚀</p>

      <button onClick={handleClick}>
        Click me
      </button>
    </div>
  );
}

export default Home;