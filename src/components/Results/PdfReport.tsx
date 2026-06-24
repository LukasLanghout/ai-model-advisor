import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { RecommendationResult, ExtractedScenario, GettingStartedResult } from '../../types';

const C = {
  teal:      '#0d9488',
  tealLight: '#ccfbf1',
  slate900:  '#0f172a',
  slate700:  '#334155',
  slate500:  '#64748b',
  slate300:  '#cbd5e1',
  slate100:  '#f1f5f9',
  white:     '#ffffff',
  green:     '#16a34a',
  red:       '#dc2626',
  amber:     '#d97706',
  violet:    '#7c3aed',
};

const s = StyleSheet.create({
  page:           { paddingTop: 48, paddingBottom: 48, paddingHorizontal: 44, fontFamily: 'Helvetica', fontSize: 9, color: C.slate700, backgroundColor: C.white },
  // Cover
  coverBand:      { backgroundColor: C.teal, marginHorizontal: -44, marginTop: -48, paddingHorizontal: 44, paddingTop: 44, paddingBottom: 36 },
  coverLabel:     { fontSize: 7, color: C.tealLight, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  coverTitle:     { fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.white, marginBottom: 6 },
  coverSub:       { fontSize: 10, color: C.tealLight },
  coverMeta:      { marginTop: 28, flexDirection: 'row', gap: 20 },
  coverMetaItem:  { flex: 1 },
  coverMetaLabel: { fontSize: 7, color: C.tealLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  coverMetaValue: { fontSize: 9, color: C.white },
  // Sections
  section:        { marginTop: 24 },
  sectionTitle:   { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.slate900, borderBottomWidth: 1.5, borderBottomColor: C.teal, paddingBottom: 4, marginBottom: 10 },
  sectionSub:     { fontSize: 8, color: C.slate500, marginBottom: 10, lineHeight: 1.5 },
  // Grid
  row2:           { flexDirection: 'row', gap: 8, marginBottom: 8 },
  metaBox:        { flex: 1, backgroundColor: C.slate100, borderRadius: 4, padding: 8 },
  metaLabel:      { fontSize: 7, color: C.slate500, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
  metaValue:      { fontSize: 9, color: C.slate900 },
  // Model cards
  modelCard:      { borderWidth: 1, borderColor: C.slate300, borderRadius: 6, padding: 12, marginBottom: 10 },
  modelCardTop:   { borderColor: C.teal, borderWidth: 1.5 },
  modelHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  modelName:      { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.slate900 },
  modelProvider:  { fontSize: 8, color: C.slate500, marginTop: 1 },
  score:          { fontSize: 18, fontFamily: 'Helvetica-Bold', color: C.teal },
  scoreLabel:     { fontSize: 7, color: C.slate500, textAlign: 'right' },
  badge:          { fontSize: 7, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 10, marginRight: 4, marginBottom: 4 },
  topBadge:       { backgroundColor: C.teal, color: C.white },
  typeBadge:      { backgroundColor: C.slate100, color: C.slate700 },
  reasoning:      { fontSize: 8.5, color: C.slate700, lineHeight: 1.5, marginBottom: 8 },
  proConsRow:     { flexDirection: 'row', gap: 8, marginBottom: 6 },
  proConBox:      { flex: 1 },
  proConLabel:    { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.slate500, textTransform: 'uppercase', marginBottom: 3 },
  bullet:         { flexDirection: 'row', gap: 4, marginBottom: 2 },
  bulletDot:      { fontSize: 8, color: C.teal, marginTop: 1 },
  bulletText:     { fontSize: 8, color: C.slate700, lineHeight: 1.4, flex: 1 },
  redDot:         { fontSize: 8, color: C.red, marginTop: 1 },
  tradeOff:       { backgroundColor: '#f0fdf4', borderLeftWidth: 2, borderLeftColor: C.teal, paddingHorizontal: 8, paddingVertical: 5, marginTop: 4 },
  tradeOffText:   { fontSize: 8, color: '#166534', lineHeight: 1.4 },
  costRow:        { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 6, borderTopWidth: 0.5, borderTopColor: C.slate300 },
  costLabel:      { fontSize: 7.5, color: C.slate500 },
  costValue:      { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: C.slate900 },
  // Getting started
  stepBox:        { backgroundColor: C.slate100, borderRadius: 5, padding: 10, marginBottom: 8 },
  stepHeader:     { flexDirection: 'row', gap: 6, marginBottom: 6 },
  stepNum:        { width: 18, height: 18, backgroundColor: C.teal, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  stepNumText:    { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.white },
  stepTitle:      { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.slate900, flex: 1, paddingTop: 2 },
  stepText:       { fontSize: 8, color: C.slate700, lineHeight: 1.5, marginBottom: 3 },
  codeBlock:      { backgroundColor: '#1e293b', borderRadius: 5, padding: 10, marginTop: 6 },
  codeText:       { fontSize: 7.5, color: '#86efac', fontFamily: 'Courier', lineHeight: 1.5 },
  promptBox:      { backgroundColor: '#f0fdfa', borderLeftWidth: 2, borderLeftColor: C.teal, paddingHorizontal: 10, paddingVertical: 8 },
  promptText:     { fontSize: 8.5, color: C.slate700, lineHeight: 1.6 },
  // Footer
  footer:         { position: 'absolute', bottom: 20, left: 44, right: 44, flexDirection: 'row', justifyContent: 'space-between' },
  footerText:     { fontSize: 7, color: C.slate300 },
  pageNum:        { fontSize: 7, color: C.slate300 },
});

interface Props {
  result:          RecommendationResult;
  scenario:        ExtractedScenario;
  gettingStarted:  GettingStartedResult | null;
  selectedModel:   { modelName: string; provider: string };
  generatedAt:     string;
}

function Bullet({ text, green }: { text: string; green: boolean }) {
  return (
    <View style={s.bullet}>
      <Text style={green ? s.bulletDot : s.redDot}>{green ? '✓' : '✗'}</Text>
      <Text style={s.bulletText}>{text}</Text>
    </View>
  );
}

function StepBlock({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <View style={s.stepBox}>
      <View style={s.stepHeader}>
        <View style={s.stepNum}><Text style={s.stepNumText}>{num}</Text></View>
        <Text style={s.stepTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function PdfReport({ result, scenario, gettingStarted, selectedModel, generatedAt }: Props) {
  const langs = Array.isArray(scenario.languages) ? scenario.languages.join(', ') : scenario.languages;

  return (
    <Document title="AI Model Adviesrapport" author="AI Model Advisor">

      {/* ── Pagina 1: Cover + Situatie + Top aanbeveling ── */}
      <Page size="A4" style={s.page}>

        {/* Cover band */}
        <View style={s.coverBand}>
          <Text style={s.coverLabel}>Persoonlijk project — Lukas Langhout</Text>
          <Text style={s.coverTitle}>AI Model Adviesrapport</Text>
          <Text style={s.coverSub}>Gegenereerd via AI Model Advisor op {generatedAt}</Text>
          <View style={s.coverMeta}>
            <View style={s.coverMetaItem}>
              <Text style={s.coverMetaLabel}>Use case</Text>
              <Text style={s.coverMetaValue}>{scenario.useCase}</Text>
            </View>
            <View style={s.coverMetaItem}>
              <Text style={s.coverMetaLabel}>Top aanbeveling</Text>
              <Text style={s.coverMetaValue}>{result.recommendations[0]?.modelName ?? '—'}</Text>
            </View>
          </View>
        </View>

        {/* Situatie */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Jouw situatie</Text>
          <View style={s.row2}>
            <View style={s.metaBox}><Text style={s.metaLabel}>Use case</Text><Text style={s.metaValue}>{scenario.useCase}</Text></View>
            <View style={s.metaBox}><Text style={s.metaLabel}>Schaal</Text><Text style={s.metaValue}>{scenario.scale}</Text></View>
          </View>
          <View style={s.row2}>
            <View style={s.metaBox}><Text style={s.metaLabel}>Snelheid</Text><Text style={s.metaValue}>{scenario.latency}</Text></View>
            <View style={s.metaBox}><Text style={s.metaLabel}>Budget</Text><Text style={s.metaValue}>{scenario.budget}</Text></View>
          </View>
          <View style={s.row2}>
            <View style={s.metaBox}><Text style={s.metaLabel}>Privacy</Text><Text style={s.metaValue}>{scenario.privacy}</Text></View>
            <View style={s.metaBox}><Text style={s.metaLabel}>Talen</Text><Text style={s.metaValue}>{langs}</Text></View>
          </View>
        </View>

        {/* Samenvatting */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Samenvatting advies</Text>
          <Text style={s.sectionSub}>{result.summary}</Text>
          {result.keyConsiderations?.length > 0 && (
            <View>
              {result.keyConsiderations.map((c, i) => (
                <View key={i} style={s.bullet}>
                  <Text style={s.bulletDot}>·</Text>
                  <Text style={s.bulletText}>{c}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Top aanbeveling */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Top aanbeveling</Text>
          {result.recommendations[0] && (() => {
            const rec = result.recommendations[0];
            return (
              <View style={[s.modelCard, s.modelCardTop]}>
                <View style={s.modelHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
                      <Text style={[s.badge, s.topBadge]}>Top keuze</Text>
                      <Text style={[s.badge, s.typeBadge]}>{rec.type === 'open-source' ? 'Open Source' : rec.type === 'cloud' ? 'Cloud' : 'Hybrid'}</Text>
                    </View>
                    <Text style={s.modelName}>{rec.modelName}</Text>
                    <Text style={s.modelProvider}>{rec.provider}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={s.score}>{rec.score.toFixed(1)}</Text>
                    <Text style={s.scoreLabel}>/ 10</Text>
                  </View>
                </View>
                <Text style={s.reasoning}>{rec.reasoning}</Text>
                <View style={s.proConsRow}>
                  <View style={s.proConBox}>
                    <Text style={s.proConLabel}>Voordelen</Text>
                    {rec.pros.map((p, i) => <Bullet key={i} text={p} green={true} />)}
                  </View>
                  <View style={s.proConBox}>
                    <Text style={s.proConLabel}>Nadelen</Text>
                    {rec.cons.map((c, i) => <Bullet key={i} text={c} green={false} />)}
                  </View>
                </View>
                {rec.tradeOff && (
                  <View style={s.tradeOff}><Text style={s.tradeOffText}>💡 {rec.tradeOff}</Text></View>
                )}
                <View style={s.costRow}>
                  <Text style={s.costLabel}>Geschatte kosten</Text>
                  <Text style={s.costValue}>{rec.estimatedMonthlyCost}</Text>
                </View>
              </View>
            );
          })()}
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>AI Model Adviesrapport · {generatedAt}</Text>
          <Text style={s.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      {/* ── Pagina 2: Alle overige aanbevelingen ── */}
      {result.recommendations.length > 1 && (
        <Page size="A4" style={s.page}>
          <View style={s.section}>
            <Text style={s.sectionTitle}>Alle aanbevelingen</Text>
            {result.recommendations.slice(1).map((rec) => (
              <View key={rec.modelId} style={s.modelCard}>
                <View style={s.modelHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
                      <Text style={[s.badge, s.typeBadge]}>#{rec.rank} · {rec.type === 'open-source' ? 'Open Source' : rec.type === 'cloud' ? 'Cloud' : 'Hybrid'}</Text>
                    </View>
                    <Text style={s.modelName}>{rec.modelName}</Text>
                    <Text style={s.modelProvider}>{rec.provider}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={s.score}>{rec.score.toFixed(1)}</Text>
                    <Text style={s.scoreLabel}>/ 10</Text>
                  </View>
                </View>
                <Text style={s.reasoning}>{rec.reasoning}</Text>
                <View style={s.proConsRow}>
                  <View style={s.proConBox}>
                    <Text style={s.proConLabel}>Voordelen</Text>
                    {rec.pros.map((p, i) => <Bullet key={i} text={p} green={true} />)}
                  </View>
                  <View style={s.proConBox}>
                    <Text style={s.proConLabel}>Nadelen</Text>
                    {rec.cons.map((c, i) => <Bullet key={i} text={c} green={false} />)}
                  </View>
                </View>
                <View style={s.costRow}>
                  <Text style={s.costLabel}>Geschatte kosten</Text>
                  <Text style={s.costValue}>{rec.estimatedMonthlyCost}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={s.footer} fixed>
            <Text style={s.footerText}>AI Model Adviesrapport · {generatedAt}</Text>
            <Text style={s.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
          </View>
        </Page>
      )}

      {/* ── Pagina 3: Aan de slag ── */}
      {gettingStarted && (
        <Page size="A4" style={s.page}>
          <View style={s.section}>
            <Text style={s.sectionTitle}>Aan de slag met {selectedModel.modelName}</Text>
            <Text style={s.sectionSub}>Stap-voor-stap gids om direct te beginnen met bouwen.</Text>

            {/* API key steps */}
            <StepBlock num={1} title={`API-toegang aanvragen bij ${selectedModel.provider}`}>
              {gettingStarted.apiKeySteps.map((step, i) => (
                <Text key={i} style={s.stepText}>{i + 1}. {step}</Text>
              ))}
              <Link src={gettingStarted.apiKeyUrl} style={{ fontSize: 8, color: C.teal, marginTop: 4 }}>
                {gettingStarted.apiKeyUrl}
              </Link>
            </StepBlock>

            {/* Local setup */}
            {gettingStarted.localSetupSteps && (
              <StepBlock num={2} title="Lokaal installeren via Ollama">
                {gettingStarted.localSetupSteps.map((step, i) => (
                  <Text key={i} style={s.stepText}>{i + 1}. {step}</Text>
                ))}
                {gettingStarted.ollamaModelName && (
                  <View style={s.codeBlock}>
                    <Text style={s.codeText}>$ ollama pull {gettingStarted.ollamaModelName}</Text>
                  </View>
                )}
              </StepBlock>
            )}

            {/* Starter prompt */}
            <StepBlock num={gettingStarted.localSetupSteps ? 3 : 2} title="Kant-en-klare startprompt voor jouw use case">
              <Text style={[s.stepText, { marginBottom: 6 }]}>Gebruik dit als systeemprompt:</Text>
              <View style={s.promptBox}>
                <Text style={s.promptText}>{gettingStarted.starterPrompt}</Text>
              </View>
            </StepBlock>

            {/* First test prompt */}
            <View style={{ backgroundColor: '#fffbeb', borderLeftWidth: 2, borderLeftColor: C.amber, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8 }}>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#92400e', marginBottom: 3 }}>Eerste bericht om te versturen</Text>
              <Text style={{ fontSize: 8.5, color: '#78350f', lineHeight: 1.5 }}>{gettingStarted.firstTestPrompt}</Text>
            </View>

            {/* Code snippet */}
            <StepBlock num={gettingStarted.localSetupSteps ? 4 : 3} title="Python code snippet om direct mee te bouwen">
              <Text style={[s.stepText, { marginBottom: 4 }]}>Vervang YOUR_API_KEY door jouw sleutel:</Text>
              <View style={s.codeBlock}>
                <Text style={s.codeText}>{gettingStarted.quickStartCode}</Text>
              </View>
            </StepBlock>
          </View>

          <View style={s.footer} fixed>
            <Text style={s.footerText}>AI Model Adviesrapport · {generatedAt}</Text>
            <Text style={s.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
          </View>
        </Page>
      )}

    </Document>
  );
}
