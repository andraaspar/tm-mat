(() => {
  const $ = document.getElementById.bind(document);
  let sorMinta = $("sor-minta").innerHTML;
  let elozmenyMinta = $("elozmeny-minta").innerHTML;
  let ertek = {
    tr: [20, 0],
    mc: [40, 1],
    vas: [0, 1],
    titan: [0, 1],
    palanta: [0, 1],
    energia: [0, 1],
    ho: [0, 1]
  };
  let valtozas = ujValtozas();
  let nevek = {
    tr: "TR",
    mc: "M€",
    vas: "Vas",
    titan: "Titán",
    palanta: "Palánta",
    energia: "Energia",
    ho: "Hő"
  };
  let elozmeny = [];
  let sorok = "";
  for (let sor of Object.keys(ertek)) {
    sorok += sorMinta.replace(/\$SOR\$/g, sor).replace(/\$NEV\$/g, nevek[sor]);
  }
  $("sorok").innerHTML = sorok;
  for (let sor of Object.keys(nevek)) {
    onclick(sor + "-ero-meg", () => {
      valtozas[sor][0]++;
      frissitsd();
    });
    onclick(sor + "-ero-bol", () => {
      valtozas[sor][0]--;
      frissitsd();
    });
    if (sor === "tr") {
      $(sor + "-bev-meg").disabled = true;
      $(sor + "-bev-bol").disabled = true;
    } else {
      onclick(sor + "-bev-meg", () => {
        valtozas[sor][1]++;
        frissitsd();
      });
      onclick(sor + "-bev-bol", () => {
        valtozas[sor][1]--;
        frissitsd();
      });
    }
  }
  onclick("valt-gomb", () => {
    elozmeny.push(valtozas);
    valtozas = ujValtozas();
    frissitsd();
  });
  onclick("gen-gomb", () => {
    elozmeny.push({
      generacio: true,
      tr: [addAzErteket("tr", 1), 0],
      mc: [addAzErteket("tr", 0) + addAzErteket("mc", 1), 0],
      vas: [addAzErteket("vas", 1), 0],
      titan: [addAzErteket("titan", 1), 0],
      palanta: [addAzErteket("palanta", 1), 0],
      energia: [-addAzErteket("energia", 0) + addAzErteket("energia", 1), 0],
      ho: [addAzErteket("energia", 0) + addAzErteket("ho", 1), 0]
    });
    frissitsd();
  });
  onclick("vissza-gomb", () => {
    if (confirm("Biztos visszavonod?")) {
      elozmeny.pop();
      frissitsd();
    }
  });
  frissitsd();
  function ujValtozas() {
    return {
      tr: [0, 0],
      mc: [0, 0],
      vas: [0, 0],
      titan: [0, 0],
      palanta: [0, 0],
      energia: [0, 0],
      ho: [0, 0]
    };
  }
  function frissitsd() {
    $("gen").innerText = elozmeny.reduce(
      (ossz, e) => (e.generacio ? ossz + 1 : ossz),
      1
    );
    for (let sor of Object.keys(ertek)) {
      frissitsdASort(sor, 0, "ero");
      frissitsdASort(sor, 1, "bev");
    }
    $("elozmenyek").innerHTML = elozmeny
      .map((e, szam) => {
        let r = elozmenyMinta;
        for (let sor of Object.keys(e)) {
          let v = e[sor];
          if (Array.isArray(v)) {
            v = v.map(elojeles).join(" ");
          } else {
            v = v ? "Igen" : "";
          }
          r = r.replace(new RegExp("\\$" + sor.toUpperCase() + "\\$", "g"), v);
        }
        if (!e.generacio) {
          r = r.replace(/\$GENERACIO\$/g, "");
        }
        return r;
      })
      .join("\n");
  }
  function frissitsdASort(sor, szam, uto) {
    $(sor + "-" + uto).innerHTML =
      "<b>" +
      addAzErteket(sor, szam) +
      "</b>" +
      (valtozas[sor][szam] ? " " + elojeles(valtozas[sor][szam]) : "");
  }
  function addAzErteket(sor, szam) {
    let r = ertek[sor][szam];
    for (let e of elozmeny) {
      r += e[sor][szam];
    }
    return r;
  }
  function elojeles(n) {
    return n >= 0 ? "+" + n : "" + n;
  }
  function onclick(id, cb) {
    $(id).addEventListener("click", cb);
  }
})()
