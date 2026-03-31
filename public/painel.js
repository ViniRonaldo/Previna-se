const ctx = document.getElementById("graficoExtintores");

new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Em dia", "Próximos do vencimento", "Vencidos"],
    datasets: [{
      data: [30, 12, 6],
      backgroundColor: ["#15803d", "#d97706", "#dc2626"],
      borderWidth: 0,
      hoverOffset: 8
    }]
  },
  options: {
    responsive: true,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 18,
          usePointStyle: true
        }
      }
    }
  }
});