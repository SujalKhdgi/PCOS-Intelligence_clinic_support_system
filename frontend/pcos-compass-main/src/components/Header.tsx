import { Activity, Heart } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-card flex items-center justify-center">
                <Activity className="h-3 w-3 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">PCOS-CDSS</h1>
              <p className="text-xs text-muted-foreground">Clinical Decision Support System</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            System Active
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
