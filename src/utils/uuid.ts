export default function() {
  return ([1e7].toString() + -1e3.toString() + -4e3.toString() + -8e3.toString() + -1e11.toString()).replace(/[018]/g, function(c: any) {
    const random = window.crypto.getRandomValues(new Uint8Array(1)) as Uint8Array;
    return (c ^ random[0] & 15 >> c / 4).toString(16);
  });
}
