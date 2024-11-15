export default function correctReturnType(returnTypeBackup, returnType) {
  if (
    ["1T", "2T", "4T", "6T", "8T"].includes(returnType[0] + returnType[1]) ||
    ["10T", "12T"].includes(returnType[0] + returnType[1] + returnType[2])
  ) {
    return returnType;
  }
  return returnTypeBackup;
}
