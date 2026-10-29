// Marca TecnoUAM: una U que custodia un punto. El punto es el equipo:
// dentro de la U = disponible, fuera = prestado.
export default function Marca({ size = 40, color = '#fff', punto = '#ff5a4f', animar = false, fuera = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" role="img" aria-label="TecnoUAM" className="marca">
      <path fill={color} d="M42 30H86V146A42 42 0 0 0 170 146V30H214V146A86 86 0 0 1 42 146Z" />
      <circle
        cx="128"
        cy="146"
        r="28"
        fill={punto}
        className={animar ? 'punto-cae' : undefined}
        style={fuera ? { transform: 'translateY(-150px)' } : undefined}
      />
    </svg>
  )
}
