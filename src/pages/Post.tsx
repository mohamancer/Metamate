import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CiSquareRemove } from 'react-icons/ci';
import { PostResponse } from '../main/PostUtil';

export type formData = {
  id: number;
  text: string;
  imagePath: string | undefined;
  page: string;
  pages: Record<string, { id: string; access_token: string; imageUrl: string }>;
  preview: string | undefined;
  success: boolean | undefined;
};

function Form({
  form,
  updateForm,
  deleteForm,
}: {
  form: formData;
  updateForm: (value: formData) => void;
  deleteForm: (formId: number) => void;
}) {
  const [formData, setFormData] = useState<formData>(form);
  const formRef = useRef<HTMLFormElement>(null);
  const readFileAsync = (file: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        resolve(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    });
  };
  const handleChange = useCallback(
    async (
      e: React.ChangeEvent<
        HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement
      >,
    ) => {
      const { name, value } = e.target;

      if ((e.target as HTMLInputElement).type === 'file') {
        const fileInput = e.target as HTMLInputElement;
        const file = fileInput.files?.[0];

        // Reset values if no file selected
        if (!file) {
          setFormData((prevData) => ({
            ...prevData,
            imagePath: undefined,
            preview: undefined,
          }));
          return;
        }

        // Read the file and set the preview
        const preview = await readFileAsync(file);
        setFormData((prevData) => {
          return { ...prevData, imagePath: file.path, preview };
        });
      } else {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    },
    [setFormData],
  );
  useEffect(() => {
    updateForm(formData);
  }, [formData, updateForm]);
  const getClassForSuccess = (success: boolean | undefined): string => {
    if (success === true) {
      return 'bg-green-400';
    }
    if (success === false) {
      return 'bg-red-400';
    }
    return 'border-gray-600';
  };
  return (
    <div className=" flex justify-start">
      <form
        key={form.id}
        ref={formRef}
        className={`relative mt-5 flex w-fit rounded-lg border-2 border-dashed border-gray-600 p-2 ${getClassForSuccess(
          form.success,
        )}`}
      >
        <button
          onClick={() => deleteForm(form.id)}
          type="button"
          className="absolute right-0 top-0 mr-1 mt-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-3xl  bg-gray-800 text-red-500 shadow-lg transition-all duration-300 ease-linear hover:rounded-xl hover:bg-red-600 hover:text-white "
        >
          <CiSquareRemove size={18} />
        </button>
        <div className="flex flex-col px-2">
          Page
          <select
            value={form.page}
            name="page"
            onChange={(event) => handleChange(event)}
            className="mt-2 w-40 resize-none rounded-lg border-gray-600 bg-gray-700 p-2 text-sm text-gray-400 shadow-transparent outline-0 focus:border-none"
          >
            <option value="">Select a page</option>
            {(Object.keys(form.pages || {}) as Array<string>).map(
              (pageName) => (
                <option key={pageName} value={pageName}>
                  {pageName}
                </option>
              ),
            )}
          </select>
          {form.page && form.pages && (
            <img
              src={form.pages[form.page].imageUrl}
              alt={form.page}
              className="mt-2 rounded-lg "
            />
          )}
        </div>
        <div className="flex h-60 w-60 flex-col px-2">
          Post
          <textarea
            name="text"
            value={form.text}
            onChange={(event) => handleChange(event)}
            className="mt-2 h-60 w-60 resize-none rounded-lg border-gray-600 bg-gray-700 p-2 text-sm text-gray-400 shadow-transparent outline-0 focus:border-none "
          />
        </div>
        <div className="ml-2 flex h-60 w-60 flex-col px-2">
          Choose Image
          <label
            htmlFor={form.id.toString()}
            className="hover:bg-bray-800 mt-2 flex h-60 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-gray-600 bg-gray-700 bg-cover bg-center bg-no-repeat hover:border-gray-500 hover:bg-gray-600"
          >
            {formData.preview ? (
              <img
                src={formData.preview}
                alt={formData.preview}
                className="h-52 w-full cursor-pointer rounded-lg object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <svg
                  className="mb-4 h-8 w-8 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-400">PNG, JPG</p>
              </div>
            )}

            <input
              onChange={(event) => handleChange(event)}
              name="imagePath"
              id={formData.id.toString()}
              type="file"
              className="hidden"
            />
          </label>
        </div>
      </form>
    </div>
  );
}

function Post() {
  const [pages, setPages] =
    useState<
      Record<string, { id: string; access_token: string; imageUrl: string }>
    >();
  const [forms, setForms] = useState<formData[]>([]);
  const [errorList, setErrorList] = useState<PostResponse[]>([]);
  const addForm = () => {
    if (!pages) {
      return;
    }
    setForms((prevForms) => [
      ...prevForms,
      {
        id: Date.now(),
        text: '',
        imagePath: undefined,
        page: '',
        preview: undefined,
        pages,
        success: undefined,
      },
    ]);
  };
  const getValidForms = (): formData[] => {
    let validForms: formData[] = [];

    validForms = forms.filter((form) => {
      return form.page && form.text !== '';
    });

    return validForms;
  };
  const postAll = async () => {
    const validForms = getValidForms();

    if (validForms.length === 0) {
      // Display an error message or handle the case when there are no valid forms
      console.log('No valid forms. Please fill in all required fields.');
      return;
    }
    setErrorList(await window.electron.postForms(validForms));
  };
  useEffect(() => {
    // Update the success field of each form based on the error list
    const updatedForms = forms.map((form) => {
      const error = errorList.find((e) => e.postId === form.id);
      if (error) {
        return { ...form, success: error.success };
      }
      return form;
    });
    setForms(updatedForms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorList]);
  const deleteForm = (formId: number) => {
    setForms((prevForms) => prevForms.filter((form) => form.id !== formId));
  };
  const updateForm = useCallback(
    (updatedForm: formData) => {
      setForms((prevForms) =>
        prevForms.map((form) =>
          form.id === updatedForm.id ? updatedForm : form,
        ),
      );
    },
    [setForms],
  );
  useEffect(() => {
    console.log('forms reloaded');
    const loadedForms = localStorage.getItem(`forms`);
    if (loadedForms) {
      setForms(JSON.parse(loadedForms));
    }
    const loadedPages = localStorage.getItem(`pages`);
    if (loadedPages) {
      console.log('load');
      setPages(JSON.parse(loadedPages));
    }
  }, []);
  useEffect(() => {
    console.log('forms changed');
    localStorage.setItem(`forms`, JSON.stringify(forms));
  }, [forms]);

  useEffect(() => {
    window.electron.pageMap(
      (
        _: any,
        map: React.SetStateAction<
          | Record<
              string,
              { id: string; access_token: string; imageUrl: string }
            >
          | undefined
        >,
      ) => {
        console.log('setpages');
        setPages(map);
      },
    );
    return () => {
      console.log('unmount');
      // Cleanup: Remove the listener when the component unmounts
      window.electron.removePageListener();
    };
  }, []);

  useEffect(() => {
    if (!pages) {
      return;
    }
    setForms((prevForms) => {
      return prevForms.map((form) => {
        return { ...form, pages };
      });
    });
    console.log('save');
    localStorage.setItem(`pages`, JSON.stringify(pages));
  }, [pages]);

  return (
    <div className="mt-20 flex w-full flex-col ">
      <div className="mx-5 flex justify-between rounded-lg">
        <button
          onClick={addForm}
          type="button"
          className="flex h-10 w-fit cursor-pointer items-center justify-center rounded-3xl
                 bg-gray-800 px-4  text-green-500
                 shadow-lg transition-all duration-300 ease-linear hover:rounded-xl hover:bg-green-600 hover:text-white"
        >
          Add Post
        </button>
        <button
          onClick={postAll}
          type="button"
          className="flex h-10 w-fit cursor-pointer items-center justify-center rounded-3xl
                 bg-gray-800 px-4  text-green-500
                 shadow-lg transition-all duration-300 ease-linear hover:rounded-xl hover:bg-green-600 hover:text-white"
        >
          Post All
        </button>
      </div>
      {forms.map((form) => (
        <Form
          key={form.id}
          form={form}
          updateForm={updateForm}
          deleteForm={deleteForm}
        />
      ))}
    </div>
  );
}

export default Post;
