import { motion } from "framer-motion"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

const defaults = [
  { question: "Do I need Web3 experience?", answer: "No! We welcome developers of all backgrounds with workshops and mentors." },
  { question: "Can I participate solo?", answer: "Yes, solo participation is allowed." },
  { question: "Is it free?", answer: "Participation is completely free." },
]

export default function FAQSection({ faqs }) {
  const items = faqs?.length > 0 ? faqs : defaults
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4">FAQ</h2>
          <p className="text-muted-foreground text-lg">Everything you need to know</p>
        </motion.div>
        <Accordion type="single" collapsible>
          {items.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

