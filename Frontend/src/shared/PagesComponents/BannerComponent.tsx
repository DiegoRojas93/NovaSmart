interface Props {
  bannerUrl?: string
}

const BannerComponent = ( { bannerUrl }:Props ) => (
  <div className="w-full h-64 bg-border-subtle relative">
    {
      bannerUrl ? (
        <img 
          src={ bannerUrl } 
          alt="Banner de la Institución" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex justify-center items-center text-gray-500">
          Sin Banner Registrado
        </div>
      )
    }
  </div>
)


export default BannerComponent
