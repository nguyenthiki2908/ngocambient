(function () {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach((item) => {
    if (item.getAttribute("href") === current) {
      item.classList.add("active");
    }
  });

  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          reveal.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.13 }
  );

  document.querySelectorAll("[data-reveal]").forEach((node) => reveal.observe(node));

  document.querySelectorAll("[data-count]").forEach((counter) => {
    const goal = Number(counter.getAttribute("data-count"));
    if (!Number.isFinite(goal)) return;
    const duration = 1200;
    const start = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const val = Math.floor(progress * goal);
      counter.textContent = `${val}${counter.dataset.suffix || ""}`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  });

  const svg = document.getElementById("network");
  if (svg) {
    const ns = "http://www.w3.org/2000/svg";
    const points = [];
    const lines = [];
    const width = 520;
    const height = 320;

    for (let i = 0; i < 30; i += 1) {
      const cx = Math.random() * width;
      const cy = Math.random() * height;
      const circle = document.createElementNS(ns, "circle");
      circle.setAttribute("cx", cx.toFixed(2));
      circle.setAttribute("cy", cy.toFixed(2));
      circle.setAttribute("r", "2.1");
      circle.setAttribute("fill", i % 2 === 0 ? "#3ae9c5" : "#5aa8ff");
      svg.appendChild(circle);
      points.push({ x: cx, y: cy, vx: (Math.random() - 0.5) * 0.7, vy: (Math.random() - 0.5) * 0.7, node: circle });
    }

    for (let i = 0; i < 60; i += 1) {
      const line = document.createElementNS(ns, "line");
      line.setAttribute("stroke", "rgba(100, 188, 255, 0.26)");
      line.setAttribute("stroke-width", "1");
      svg.insertBefore(line, svg.firstChild);
      lines.push(line);
    }

    function animate() {
      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.node.setAttribute("cx", p.x.toFixed(2));
        p.node.setAttribute("cy", p.y.toFixed(2));
      });

      let idx = 0;
      for (let i = 0; i < points.length && idx < lines.length; i += 1) {
        for (let j = i + 1; j < points.length && idx < lines.length; j += 1) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 70) {
            const op = (1 - dist / 70) * 0.33;
            const line = lines[idx];
            line.setAttribute("x1", points[i].x.toFixed(2));
            line.setAttribute("y1", points[i].y.toFixed(2));
            line.setAttribute("x2", points[j].x.toFixed(2));
            line.setAttribute("y2", points[j].y.toFixed(2));
            line.setAttribute("stroke", `rgba(90,180,255,${op.toFixed(3)})`);
            idx += 1;
          }
        }
      }

      for (; idx < lines.length; idx += 1) {
        lines[idx].setAttribute("x1", "0");
        lines[idx].setAttribute("x2", "0");
        lines[idx].setAttribute("y1", "0");
        lines[idx].setAttribute("y2", "0");
      }

      requestAnimationFrame(animate);
    }

    animate();
  }
})();
