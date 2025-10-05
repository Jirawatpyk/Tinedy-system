import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Protected dashboard page
 *
 * This page is wrapped by the DashboardLayout (via protected layout) which provides
 * navigation sidebar and header with authentication controls.
 */
export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-bold text-trust">
          Dashboard
        </h1>
        <p className="font-body text-base text-slate-600">
          ยินดีต้อนรับสู่ระบบจัดการการจอง Tinedy Solutions
        </p>
      </header>

      {/* Design System Showcase */}
      <Card className="border-care">
          <CardHeader>
            <CardTitle className="font-display text-trust">
              Design System Showcase
            </CardTitle>
            <CardDescription>
              ตัวอย่างสี และ Typography ของ Tinedy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Color Palette */}
            <section aria-labelledby="color-palette-heading">
              <h3 id="color-palette-heading" className="font-semibold text-sm mb-3">Color Palette:</h3>
              <div className="flex gap-3 flex-wrap" role="list">
                <div className="flex flex-col items-center gap-2" role="listitem">
                  <div className="w-16 h-16 rounded-lg bg-trust" aria-label="Trust color: Deep navy #2e4057" />
                  <span className="text-xs">Trust</span>
                </div>
                <div className="flex flex-col items-center gap-2" role="listitem">
                  <div className="w-16 h-16 rounded-lg bg-eco" aria-label="Eco color: Sage green #8fbc96" />
                  <span className="text-xs">Eco</span>
                </div>
                <div className="flex flex-col items-center gap-2" role="listitem">
                  <div className="w-16 h-16 rounded-lg bg-care" aria-label="Care color: Soft blue-grey #d0dae7" />
                  <span className="text-xs">Care</span>
                </div>
                <div className="flex flex-col items-center gap-2" role="listitem">
                  <div className="w-16 h-16 rounded-lg bg-simplicity border" aria-label="Simplicity color: Warm beige #f5f3ee" />
                  <span className="text-xs">Simplicity</span>
                </div>
                <div className="flex flex-col items-center gap-2" role="listitem">
                  <div className="w-16 h-16 rounded-lg bg-dirty" aria-label="Dirty color: Dark brown #2d241d" />
                  <span className="text-xs">Dirty</span>
                </div>
              </div>
            </section>

            {/* Typography */}
            <section aria-labelledby="typography-heading">
              <h3 id="typography-heading" className="font-semibold text-sm mb-3">Typography:</h3>
              <div className="space-y-2" role="list">
                <p className="font-display text-xl md:text-2xl" role="listitem">Raleway - Display Font</p>
                <p className="font-body text-sm md:text-base" role="listitem">Poppins - Body Font</p>
                <p className="font-mono text-xs md:text-sm" role="listitem">JetBrains Mono - Code Font</p>
              </div>
            </section>

            {/* Components */}
            <section aria-labelledby="components-heading">
              <h3 id="components-heading" className="font-semibold text-sm mb-3">Components:</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-trust hover:bg-trust/90 text-simplicity" aria-label="Primary button example">
                  Primary Button
                </Button>
                <Button variant="outline" aria-label="Outline button example">
                  Outline Button
                </Button>
              </div>
            </section>
          </CardContent>
        </Card>
    </div>
  );
}
