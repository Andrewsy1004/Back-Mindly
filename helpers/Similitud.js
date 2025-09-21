
export const calcularSimilitud = (usuarioA, usuarioB) => {
  const textoA = (usuarioA.profesion + " " + usuarioA.biografia).toLowerCase();
  const textoB = (usuarioB.profesion + " " + usuarioB.biografia).toLowerCase();

  const palabrasA = new Set(textoA.split(/\W+/));
  const palabrasB = new Set(textoB.split(/\W+/));

  let interseccion = 0;
  palabrasA.forEach(p => {
    if (palabrasB.has(p) && p.length > 3) {
      interseccion++;
    }
  });

  return interseccion / Math.max(palabrasA.size, palabrasB.size);
}
