import LogoutButton from "@/components/atoms/LogoutButton";
import Map from "@/components/molecules/Map";
import InfoSheet from "@/components/organisms/InfoSheet";

const Home = () => {
  return (
    <div className="h-screen flex flex-col">
      <InfoSheet />
      <div className="flex-1 relative z-0 overflow-hidden">
        <Map />
      </div>
      <div className="absolute z-1 bottom-4 left-4">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Home;
