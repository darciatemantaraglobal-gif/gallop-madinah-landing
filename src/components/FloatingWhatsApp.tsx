const WHATSAPP_LINK = "https://wa.me/6281234567890?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

const FloatingWhatsApp = () => {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="Chat WhatsApp"
    >
      <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_32px_rgba(37,211,102,0.55)] hover:scale-105 transition-all duration-300">
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <svg viewBox="0 0 32 32" className="w-7 h-7 md:w-8 md:h-8 fill-white relative z-10">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.052 9.38L1.056 31.2l6.076-1.952A15.918 15.918 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.598c-.39 1.1-1.932 2.014-3.168 2.28-.846.18-1.95.324-5.67-1.218-4.762-1.972-7.824-6.81-8.062-7.126-.228-.316-1.918-2.554-1.918-4.872s1.214-3.456 1.644-3.928c.39-.428.918-.536 1.224-.536.152 0 .288.002.41.008.39.016.586.038.844.654.322.77 1.1 2.68 1.196 2.876.098.196.196.462.064.738-.122.284-.232.462-.428.698-.196.236-.41.418-.606.672-.178.218-.378.452-.16.87.218.412.968 1.596 2.08 2.586 1.432 1.27 2.638 1.664 3.012 1.848.374.184.594.154.812-.094.228-.254.968-1.122 1.226-1.508.254-.386.508-.322.858-.194.354.128 2.248 1.06 2.632 1.254.386.194.642.29.738.452.094.16.094.928-.296 2.028z" />
        </svg>
      </div>
    </a>
  );
};

export default FloatingWhatsApp;
