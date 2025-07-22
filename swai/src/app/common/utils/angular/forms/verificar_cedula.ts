// export function verificar_cedula(): AsyncValidatorFn {
//   return (
//     control: AbstractControl<string>,
//   ): Observable<{ cedula_registrada: true } | null> => {
//     return control.valueChanges.pipe(
//       debounceTime(1000),
//       first(),
//       mergeMap((cedula) => {
//         return from(inject(AppService).obtenerPersona(+cedula));
//       }),
//       map((res) => {
//         if (res)
//           return {
//             cedula_registrada: true,
//           };
//         return null;
//       }),
//       tap(console.log),
//     );
//   };
// }
