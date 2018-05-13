export default function generateElementWithMessage(msg){
  let element = document.createElement("div");
  element.innerHTML = `${msg}`;
  return element;
}
