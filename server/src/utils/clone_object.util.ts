export function clone_object<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
