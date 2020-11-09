interface IVariables {
  container: Element;
  points: number[];
  defaultWaveColor: {
    top: string;
    bottom: string;
  };
  animatedWaveColor: {
    top: string;
    bottom: string;
  };
  spaceBetween: number;
  cellWidth: number;
}

export default IVariables;
