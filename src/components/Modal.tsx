import { FC, ReactNode } from 'react';

type ModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  children: ReactNode; // adiciona a propriedade children

};

const Modal: FC<ModalProps> = ({ handleClose, children }) => {
  return (
<div className="fixed z-10 inset-0 overflow-y-auto">
  <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={handleClose}>
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>

    <div className="inline-block align-bottom bg-[#201F25] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="bg-[#201F25] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex flex-col sm:items-start">

          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-white">{children}</h3>
          </div>
        </div>
      </div>
      <div className="bg-[#201F25] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-white-600 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleClose}>
          Fechar
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default Modal;
