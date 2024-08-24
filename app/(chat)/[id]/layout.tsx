import ToastLayout from "@/components/toastLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ToastLayout />
      {children}
    </div>
  );
}
