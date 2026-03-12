export default function ConfirmModal({ member, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm px-10 py-8 flex flex-col items-center gap-6">
        <p className="text-gray-800 text-lg font-semibold text-center">
          Do you want to ask this member to help with this task?
        </p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="bg-green-500 hover:bg-green-600 active:scale-95 text-white font-semibold px-8 py-2.5 rounded-full transition-all"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold px-8 py-2.5 rounded-full transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}