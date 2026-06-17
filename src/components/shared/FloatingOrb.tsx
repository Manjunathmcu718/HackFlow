import { motion } from "framer-motion";
import type { CSSProperties } from "react";

type FloatingOrbProps = {
  style: CSSProperties & { dur?: number; del?: number };
  scale?: boolean;
};

export default function FloatingOrb({ style, scale = false }: FloatingOrbProps) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={scale ? { y:[0,-30,0], x:[0,15,0], scale:[1,1.08,1] } : { y:[0,-24,0], x:[0,12,0] }}
      transition={{ duration:style.dur || 9, repeat:Infinity, ease:"easeInOut", delay:style.del || 0 }}
    />
  );
}
