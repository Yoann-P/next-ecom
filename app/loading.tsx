import Image from "next/image";
import loader from "@/app/assets/loader.gif"

const LoadingPage = () => {
    return (
        <div className={"flex justify-center items-center h-screen w-screen"}>
            <Image src={loader} alt={"loader"} width={150} height={150}/>
        </div>
    )
}
export default LoadingPage
