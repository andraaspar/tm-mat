(() => {
  const $ = document.getElementById.bind(document);
  let sorMinta = $("sor-minta").innerHTML;
  let elozmenyMinta = $("elozmeny-minta").innerHTML;
  let ertek = {
    tr: [20, 0],
    mc: [42, 1],
    acel: [0, 1],
    titan: [0, 1],
    palanta: [0, 1],
    energia: [0, 1],
    ho: [0, 1]
  };
  let valtozas = JSON.parse(sessionStorage["valtozas"] || "null") || ujValtozas();
  let nevek = {
    tr: "TR",
    mc: "M€",
    acel: "Acél",
    titan: "Titán",
    palanta: "Palánta",
    energia: "Energia",
    ho: "Hő"
  };
  let elozmeny = JSON.parse(sessionStorage["elozmeny"] || "null") || [];
  let oldal = 0;
  let oldalMeret = 5;
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
      acel: [addAzErteket("acel", 1), 0],
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
  onclick("elozo-oldal", () => {
    oldal--;
    frissitsd();
  });
  onclick("kovetkezo-oldal", () => {
    oldal++;
    frissitsd();
  });
  frissitsd();
  function ujValtozas() {
    return {
      tr: [0, 0],
      mc: [0, 0],
      acel: [0, 0],
      titan: [0, 0],
      palanta: [0, 0],
      energia: [0, 0],
      ho: [0, 0]
    };
  }
  function frissitsd() {
    sessionStorage["elozmeny"] = JSON.stringify(elozmeny);
    sessionStorage["valtozas"] = JSON.stringify(valtozas);
    $("gen").innerText = elozmeny.reduce(
      (ossz, e) => (e.generacio ? ossz + 1 : ossz),
      1
    );
    for (let sor of Object.keys(ertek)) {
      frissitsdASort(sor, 0, "ero");
      frissitsdASort(sor, 1, "bev");
    }
    $("elozmenyek").innerHTML = elozmeny.reduceRight((mind, e, szam) => {
      if (
        elozmeny.length - szam - 1 < oldal * oldalMeret ||
        elozmeny.length - szam - 1 >= (oldal + 1) * oldalMeret
      ) {
        return mind;
      }
      let r = elozmenyMinta;
      for (let sor of Object.keys(e)) {
        let v = e[sor];
        if (Array.isArray(v)) {
          v = v.map(elojeles).join("<br>");
        } else {
          v = v
            ? "<span class='icon is-small'><img src='meg.png' alt='Új'/></span>"
            : "";
        }
        r = r.replace(new RegExp("\\$" + sor.toUpperCase() + "\\$", "g"), v);
      }
      if (!e.generacio) {
        r = r.replace(/\$GENERACIO\$/g, "");
      }
      return mind + r;
    }, "");
    $("elozo-oldal").disabled = oldal === 0;
    $("kovetkezo-oldal").disabled =
      oldal === Math.ceil(elozmeny.length / oldalMeret) - 1;
  }
  function frissitsdASort(sor, szam, uto) {
    $(sor + "-" + uto).innerHTML = addAzErteket(sor, szam);
    $(sor + "-" + uto + "-valt").innerHTML = valtozas[sor][szam]
      ? elojeles(valtozas[sor][szam])
      : "";
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
})();
