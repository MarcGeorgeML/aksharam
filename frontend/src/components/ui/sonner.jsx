import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: `
            group toast 
            group-[.toaster]:w-[150px]
            group-[.toaster]:bg-a_sc
            group-[.toaster]:text-a_bg
            group-[.toaster]:text-[16px]
            group-[.toaster]:border-border 
            group-[.toaster]:shadow-lg 
            group-[.toaster]:p-4 
            group-[.toaster]:rounded-lg 
            transition-all duration-300 ease-in-out
          `,
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
