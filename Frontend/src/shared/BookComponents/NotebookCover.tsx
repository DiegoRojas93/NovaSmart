// interface Props {
//   firstName: string;
//   lastName: string;
//   rol: string;
//   banner: string;
// }

// const NotebookCover = ({ firstName, lastName, rol, banner }: Props) => (
//   <div 
//     className="animate-page-turn relative w-full h-full bg-brand-primary-3 rounded-r-3xl rounded-l-md shadow-[10px_10px_15px_rgba(0,0,0,0.5)] flex items-center justify-center border-r-8 border-b-8 border-brand-primary-2/80 overflow-hidden"
//     style={{
//       // Patrón del cuaderno
//       backgroundImage: `
//         conic-gradient(from 90deg at 1px 1px, transparent 25%, rgba(255, 255, 255, 0.15) 0%), 
//         linear-gradient(45deg, transparent calc(50% - 0.5px), rgba(255, 255, 255, 0.15) 0 calc(50% + 0.5px), transparent 0), 
//         linear-gradient(-45deg, transparent calc(50% - 0.5px), rgba(255, 255, 255, 0.15) 0 calc(50% + 0.5px), transparent 0)
//       `,
//       backgroundPosition: '-0.5px -0.5px, 0 0, 0 0',
//       backgroundSize: '1rem 1rem, 2rem 2rem, 2rem 2rem'
//     }}
//   >
    
//     {/* Lomo del cuaderno (Costura izquierda) */}
//     <div className="absolute left-0 top-0 bottom-0 w-12 md:w-16 bg-brand-primary-1 shadow-[inset_-4px_0_8px_rgba(0,0,0,0.5)] rounded-l-md border-r border-black/20 z-10"></div>
    
//     {/* Cinta marca-páginas colgando */}
//     <div className="absolute top-0 bottom-[-20px] left-24 w-6 bg-status-danger shadow-md rounded-b-sm z-10"></div>

//     {/* Etiqueta / Pegatina de la portada */}
//     <div className="relative z-20 bg-brand-primary-6 w-[85%] sm:w-4/5 max-w-md p-2 rounded-sm shadow-lg border border-brand-secundary-6 rotate-[-2deg]">
//       <div className="w-full h-full border-2 border-dashed border-brand-secundary-5 p-6 sm:p-8 flex flex-col items-center justify-center bg-white relative">
        
//         {/* --- FOTO DE LA INSTITUCIÓN (Estilo foto impresa pegada) --- */}
//         {banner && (
//           <div className="relative mb-6 rotate-[3deg] hover:rotate-0 transition-transform duration-300">
//             {/* Trozo de cinta adhesiva semitransparente */}
//             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/50 backdrop-blur-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] rotate-[-5deg] z-10"></div>
            
//             {/* Marco de la foto */}
//             <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white p-1 sm:p-2 border border-gray-200 shadow-md">
//               <img 
//                 src={banner} 
//                 alt="Banner de la Institución" 
//                 className="w-full h-full object-cover bg-gray-100" 
//               />
//             </div>
//           </div>
//         )}

//         {/* Textos de la portada */}
//         <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-primary-1 mb-1 text-center">
//           {firstName ? `${firstName} ${lastName}` : "NovaSmart"}
//         </h1>
        
//         <div className="flex flex-col items-center justify-center mb-6 text-center">
//           <h3 className="text-base sm:text-lg text-brand-secundary-3 font-bold uppercase tracking-widest">{rol}</h3>
//           <h3 className="text-sm text-brand-secundary-4 font-semibold uppercase tracking-widest">Portal Educativo</h3>
//         </div>
        
//         <div className="w-full h-px bg-brand-secundary-2/20 mb-6"></div>
        
//         <p className="text-brand-secundary-6 text-center font-medium text-sm sm:text-base">
//           Selecciona una opción en tu <b>estuche escolar</b> "menú lateral" para abrir tu cuaderno de trabajo.
//         </p>
//       </div>
//     </div>

//   </div>
// );

// export default NotebookCover;

import ShapeGrid from "../../components/ShapeGrid";

interface Props {
  firstName: string;
  lastName: string;
  rol: string;
  banner: string;
}

const NotebookCover = ({ firstName, lastName, rol, banner }: Props) => (
  <div 
    className="
      animate-page-turn
      relative
      w-full
      h-full
      bg-brand-primary-3
      rounded-r-3xl
      rounded-l-md
      shadow-[10px_10px_15px_rgba(0,0,0,0.5)]
      flex
      items-center
      justify-center
      border-r-8
      border-b-8
      border-brand-primary-2/80
      overflow-hidden
    "
  >

    {/* Patrón Shape Grid */}
    <div className="absolute inset-0 z-0">
      <ShapeGrid 
        speed={0.1}
        squareSize={70}
        direction='up' // up, down, left, right, diagonal
        borderColor="#2cc295"
        hoverFillColor='#2cc295'
        shape="hexagon" // square, hexagon, circle, triangle
        hoverTrailAmount={3} // number of trailing hovered shapes (0 = no trail)
        />
    </div>

    {/* Lomo del cuaderno */}
    <div className="
      absolute
      left-0
      top-0
      bottom-0
      w-12
      md:w-16
      bg-brand-primary-1
      shadow-[inset_-4px_0_8px_rgba(0,0,0,0.5)]
      rounded-l-md
      border-r
      border-black/20
      z-10
    " />

    {/* Cinta marca-páginas */}
    <div className="
      absolute
      top-0
      bottom-[-20px]
      left-24
      w-6
      bg-status-danger
      shadow-md
      rounded-b-sm
      z-10
    " />

    {/* Etiqueta */}
    <div className="
      relative
      z-20
      bg-brand-primary-6
      w-[85%]
      sm:w-4/5
      max-w-md
      p-2
      rounded-sm
      shadow-lg
      border
      border-brand-secundary-6
      rotate-[-2deg]
    ">
      
      <div className="
        w-full
        h-full
        border-2
        border-dashed
        border-brand-secundary-5
        p-6
        sm:p-8
        flex
        flex-col
        items-center
        justify-center
        bg-white
        relative
      ">

        {/* FOTO */}
        {banner && (
          <div className="
            relative
            mb-6
            rotate-[3deg]
            hover:rotate-0
            transition-transform
            duration-300
          ">
            <div className="
              absolute
              -top-3
              left-1/2
              -translate-x-1/2
              w-16
              h-6
              bg-white/50
              backdrop-blur-[2px]
              shadow-[0_1px_2px_rgba(0,0,0,0.1)]
              rotate-[-5deg]
              z-10
            " />

            <div className="
              w-28
              h-28
              sm:w-32
              sm:h-32
              bg-white
              p-1
              sm:p-2
              border
              border-gray-200
              shadow-md
            ">
              <img
                src={banner}
                alt="Banner de la Institución"
                className="w-full h-full object-cover bg-gray-100"
              />
            </div>
          </div>
        )}

        {/* Textos */}
        <h1 className="
          text-2xl
          sm:text-3xl
          font-extrabold
          text-brand-primary-1
          mb-1
          text-center
        ">
          {firstName ? `${firstName} ${lastName}` : "NovaSmart"}
        </h1>

        <div className="
          flex
          flex-col
          items-center
          justify-center
          mb-6
          text-center
        ">
          <h3 className="
            text-base
            sm:text-lg
            text-brand-secundary-3
            font-bold
            uppercase
            tracking-widest
          ">
            {rol}
          </h3>

          <h3 className="
            text-sm
            text-brand-secundary-4
            font-semibold
            uppercase
            tracking-widest
          ">
            Portal Educativo
          </h3>
        </div>

        <div className="w-full h-px bg-brand-secundary-2/20 mb-6" />

        <p className="
          text-brand-secundary-6
          text-center
          font-medium
          text-sm
          sm:text-base
        ">
          Selecciona una opción en tu <b>estuche escolar</b> "menú lateral"
          para abrir tu cuaderno de trabajo.
        </p>

      </div>
    </div>

  </div>
);

export default NotebookCover;