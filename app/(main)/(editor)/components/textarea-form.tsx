import { Label } from "@/components/ui/label";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"; // Shadcn UI Form components
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { tsxToJson } from "../utils/util";
import { useTree } from "@/components/context/tree-context";

const formSchema = z.object({
  message: z.string().min(10, { message: "A mensagem deve ter pelo menos 10 caracteres" }),
});

type FormSchema = z.infer<typeof formSchema>;

const textareaSchema = z.object({
  message: z
    .string()
    .min(10, { message: "min 10 characters" }),
});

const TextareaForm = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = textareaSchema.safeParse({ message });

    if (!result.success) {
      setError(result.error.errors[0].message);
    } else {
      setError(null);
      console.log("Formulário enviado com sucesso:", message);
    }
  };

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const {getTree, setTree} = useTree();

  const tree = getTree('root')

  const onSubmit = (data: FormSchema) => {
    tsxToJson(data.message, tree, setTree)
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-1 flex-col space-y-2 h-full ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full space-y-6">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="h-[calc(100vh-20rem)] max-h-screen mb-10">
                  <FormLabel>Code TSX</FormLabel>
                  <FormControl>
                    <Textarea placeholder="paste code here..." {...field} className="h-full" />
                  </FormControl>
                  <FormMessage /> {/* Exibe a mensagem de erro */}
                </FormItem>
              )}
            />

            {/* Botão de envio */}
            <Button type="submit" className="w-full">
              Send
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TextareaForm;
