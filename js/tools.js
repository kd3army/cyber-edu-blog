/**
 * GreenShield Academy — Tools directory
 */

(function () {
  "use strict";

  const TOOLS = [
    {
      id: "nmap",
      name: "Nmap",
      category: "recon",
      categoryLabel: "Reconnaissance",
      difficulty: "beginner",
      description:
        "Network mapper for host discovery, port scanning, service/version detection, and OS fingerprinting. Essential for the reconnaissance phase of penetration testing.",
      steps: [
        "Install Nmap on your lab machine (Linux: apt install nmap, Windows: download from nmap.org).",
        "Run a basic ping sweep to find live hosts on your authorized lab subnet.",
        "Perform a TCP SYN scan on common ports against a single target you own.",
        "Use service detection (-sV) to identify running services and versions.",
        "Export results to a file for documentation and further analysis."
      ],
      command: "nmap -sS -sV -O -p- 192.168.1.10 -oN scan-results.txt",
      note: "Only scan networks and hosts you own or have written permission to test."
    },
    {
      id: "wireshark",
      name: "Wireshark",
      category: "network",
      categoryLabel: "Network Analysis",
      difficulty: "intermediate",
      description:
        "Protocol analyzer for capturing and inspecting network traffic in real time. Used for troubleshooting, intrusion detection, and understanding application behavior.",
      steps: [
        "Install Wireshark and ensure you have permission to capture on the chosen interface.",
        "Select the correct network interface and start a capture in your isolated lab.",
        "Apply display filters (e.g., http, dns, tcp.port == 443) to narrow traffic.",
        "Follow TCP streams to reconstruct conversations between client and server.",
        "Save the capture (.pcap) for offline review and incident documentation."
      ],
      command: 'wireshark -i eth0 -k -f "tcp port 80 or tcp port 443"',
      note: "Capturing traffic on networks you do not administer may violate policy or law."
    },
    {
      id: "metasploit",
      name: "Metasploit Framework",
      category: "exploit",
      categoryLabel: "Exploitation",
      difficulty: "advanced",
      description:
        "Penetration testing platform for developing, testing, and executing exploits against vulnerable systems in controlled environments.",
      steps: [
        "Start msfconsole in a dedicated lab VM with Metasploit installed.",
        "Search for modules relevant to your target's verified software version.",
        "Configure module options: RHOSTS, LHOST, LPORT, and payload settings.",
        "Run the module against an intentionally vulnerable machine (e.g., Metasploitable).",
        "Establish a session, gather proof-of-concept evidence, and document findings."
      ],
      command: "msfconsole\nsearch eternalblue\nuse exploit/windows/smb/ms17_010_eternalblue",
      note: "Use only against systems you own or have explicit authorization to test."
    },
    {
      id: "burp-suite",
      name: "Burp Suite",
      category: "web",
      categoryLabel: "Web Security",
      difficulty: "intermediate",
      description:
        "Integrated platform for web application security testing — intercepting proxies, scanners, intruder, and repeater for manual and automated analysis.",
      steps: [
        "Configure your browser to route HTTP(S) traffic through Burp's proxy (127.0.0.1:8080).",
        "Install Burp's CA certificate to intercept HTTPS in your test application.",
        "Browse the target web app and review requests/responses in the Proxy tab.",
        "Send interesting requests to Repeater to modify parameters and observe responses.",
        "Use Intruder for controlled fuzzing on inputs you are authorized to test."
      ],
      command: "# Browser proxy settings\nHTTP Proxy: 127.0.0.1:8080\nHTTPS Proxy: 127.0.0.1:8080",
      note: "Test only applications you own or have a signed scope of work for."
    },
    {
      id: "nikto",
      name: "Nikto",
      category: "web",
      categoryLabel: "Web Security",
      difficulty: "beginner",
      description:
        "Web server scanner that checks for outdated software, dangerous files, misconfigurations, and common vulnerabilities on HTTP/HTTPS services.",
      steps: [
        "Identify the target URL in your authorized scope (e.g., http://lab-app.local).",
        "Run a basic Nikto scan against the web root.",
        "Review output for informational findings and potential misconfigurations.",
        "Cross-reference results with manual verification — not all findings are exploitable.",
        "Document confirmed issues with severity and remediation recommendations."
      ],
      command: "nikto -h http://192.168.1.50 -o nikto-report.html -Format html",
      note: "Automated scanners can be noisy; use only on systems you are permitted to assess."
    },
    {
      id: "hydra",
      name: "Hydra",
      category: "recon",
      categoryLabel: "Credential Testing",
      difficulty: "advanced",
      description:
        "Fast network logon cracker supporting many protocols (SSH, FTP, HTTP, RDP). Used in labs to demonstrate weak-password risks and test lockout policies.",
      steps: [
        "Set up a lab service with a known weak account for learning purposes.",
        "Prepare a small, authorized wordlist — never use real breached credentials.",
        "Select the correct protocol module (-l user -P wordlist.txt ssh://target).",
        "Run with conservative thread counts to avoid destabilizing lab systems.",
        "Analyze results and implement strong password policies and MFA as mitigation."
      ],
      command: "hydra -l admin -P lab-wordlist.txt ssh://192.168.1.20 -t 4",
      note: "Brute-force attacks against systems without authorization are illegal."
    }
  ];

  const grid = document.getElementById("tools-grid");
  const searchInput = document.getElementById("tool-search");
  const countEl = document.getElementById("tools-count");
  const emptyEl = document.getElementById("tools-empty");
  const filterBtns = document.querySelectorAll(".filter-btn");

  if (!grid) return;

  let activeFilter = "all";
  let searchQuery = "";

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function createToolCard(tool) {
    const article = document.createElement("article");
    article.className = "tool-card";
    article.id = tool.id;
    article.dataset.category = tool.category;
    article.dataset.search = (tool.name + " " + tool.description + " " + tool.categoryLabel).toLowerCase();

    const stepsHtml = tool.steps
      .map(function (step) {
        return "<li>" + escapeHtml(step) + "</li>";
      })
      .join("");

    article.innerHTML =
      '<div class="tool-card__header">' +
        '<div class="tool-card__meta">' +
          '<span class="tool-card__category">' + escapeHtml(tool.categoryLabel) + "</span>" +
          '<span class="badge badge--' + tool.difficulty + '">' + escapeHtml(tool.difficulty) + "</span>" +
        "</div>" +
        "<h2 class=\"tool-card__title\">" + escapeHtml(tool.name) + "</h2>" +
        '<p class="tool-card__desc">' + escapeHtml(tool.description) + "</p>" +
      "</div>" +
      '<div class="tool-card__body">' +
        '<button type="button" class="tool-card__toggle" aria-expanded="false" aria-controls="tutorial-' + tool.id + '">' +
          "<span>Usage Tutorial</span>" +
          '<span class="tool-card__toggle-icon" aria-hidden="true">▼</span>' +
        "</button>" +
        '<div class="tool-card__tutorial" id="tutorial-' + tool.id + '">' +
          '<div class="tool-card__tutorial-inner">' +
            '<p class="tool-card__section-title">Step-by-step guide</p>' +
            '<ol class="tool-card__steps">' + stepsHtml + "</ol>" +
            '<p class="tool-card__section-title">Example command</p>' +
            '<code class="tool-card__code">' + escapeHtml(tool.command) + "</code>" +
            '<p class="tool-card__note">' + escapeHtml(tool.note) + "</p>" +
          "</div>" +
        "</div>" +
      "</div>";

    const toggleBtn = article.querySelector(".tool-card__toggle");
    const tutorial = article.querySelector(".tool-card__tutorial");

    toggleBtn.addEventListener("click", function () {
      const isOpen = tutorial.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });

    return article;
  }

  function renderTools() {
    grid.innerHTML = "";
    TOOLS.forEach(function (tool) {
      grid.appendChild(createToolCard(tool));
    });
    applyFilters();
  }

  function applyFilters() {
    const cards = grid.querySelectorAll(".tool-card");
    let visibleCount = 0;
    const query = searchQuery.trim().toLowerCase();

    cards.forEach(function (card) {
      const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
      const matchesSearch = !query || card.dataset.search.includes(query);
      const visible = matchesCategory && matchesSearch;

      card.classList.toggle("is-hidden", !visible);
      if (visible) visibleCount++;
    });

    if (countEl) {
      countEl.textContent = visibleCount + " tool" + (visibleCount === 1 ? "" : "s") + " shown";
    }

    if (emptyEl) {
      emptyEl.hidden = visibleCount > 0;
    }
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("filter-btn--active");
      });
      btn.classList.add("filter-btn--active");
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchQuery = searchInput.value;
      applyFilters();
    });
  }

  renderTools();

  const hash = window.location.hash.slice(1);
  if (hash) {
    requestAnimationFrame(function () {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        const toggleBtn = target.querySelector(".tool-card__toggle");
        const tutorial = target.querySelector(".tool-card__tutorial");
        if (toggleBtn && tutorial) {
          tutorial.classList.add("is-open");
          toggleBtn.setAttribute("aria-expanded", "true");
        }
      }
    });
  }
})();
