import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { pick, types, isErrorWithCode, errorCodes } from '@react-native-documents/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStyles from '@hooks/useStyles';
import { useTheme } from '@hooks/useTheme';
import useAppDispatch from '@hooks/useAppDispatch';
import useAppSelector from '@hooks/useAppSelector';
import {
  ThemedText,
  ThemedCard,
  ThemedButton,
  ThemedDivider,
} from '@components/themed';
import { ProgressBar } from '@components/common';
import { uploadSchedule, downloadSampleTemplate } from '../api/scheduleApi';
import { setBlocks, setLastUploadedAt } from '@store/slices/scheduleSlice';

// ─── Upload Icon ──────────────────────────────────────────────────────────────
const UploadIcon: React.FC = () => {
  const { theme } = useTheme();
  const styles = useStyles((t) => ({
    iconBox: {
      width:           56,
      height:          56,
      borderRadius:    t.radius.lg,
      backgroundColor: t.colors.surface.elevated,
      alignItems:      'center',
      justifyContent:  'center',
      marginBottom:    t.spacing.md,
    },
    arrow: {
      fontSize:   24,
      color:      t.colors.brand.primary,
    },
  }));

  return (
    <View style={styles.iconBox}>
      <ThemedText style={styles.arrow}>↑</ThemedText>
    </View>
  );
};

// ─── Format Rules Card ────────────────────────────────────────────────────────
const FormatRulesCard: React.FC = () => {
  const styles = useStyles((t) => ({
    card: {
      borderLeftWidth: 3,
      borderLeftColor: t.colors.brand.primary,
      backgroundColor: t.colors.category.dimag.bg,
    },
    rule: {
      flexDirection: 'row',
      gap:           t.spacing.xs,
      marginTop:     t.spacing.xs,
    },
  }));

  const rules = [
    '1 sheet = 1 time block',
    'Row 1: Block Name',
    'Row 2: Start Time (04:30)',
    'Row 3: End Time (07:00)',
    'Row 6+: Tasks + Category',
  ];

  return (
    <ThemedCard style={styles.card}>
      <ThemedText variant="h3" color="brand">Excel Format Rules</ThemedText>
      {rules.map((rule, i) => (
        <View key={i} style={styles.rule}>
          <ThemedText variant="caption" color="muted">•</ThemedText>
          <ThemedText variant="caption" color="secondary">{rule}</ThemedText>
        </View>
      ))}
    </ThemedCard>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
interface UploadScreenProps {
  navigation?: {
    navigate: (screen: string) => void;
    replace:  (screen: string) => void;
  };
}

type UploadState = 'idle' | 'picking' | 'uploading' | 'success' | 'error';

const UploadScreen: React.FC<UploadScreenProps> = ({ navigation }) => {
  const dispatch   = useAppDispatch();
  const isLoaded   = useAppSelector((s) => s.schedule.isLoaded);

  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [progress,    setProgress]    = useState(0);
  const [errorMsg,    setErrorMsg]    = useState('');

  const styles = useStyles((t) => ({
    safe: {
      flex:            1,
      backgroundColor: t.colors.background.primary,
    },
    scroll: {
      flexGrow:          1,
      paddingHorizontal: t.spacing.lg,
      paddingBottom:     t.spacing.xxxl,
    },
    header: {
      alignItems:   'center',
      paddingTop:   t.spacing.xl,
      paddingBottom: t.spacing.lg,
      gap:          t.spacing.xs,
    },
    uploadCard: {
      alignItems:    'center',
      paddingVertical: t.spacing.xl,
      borderStyle:   'dashed',
      borderWidth:   1,
      borderColor:   t.colors.surface.border,
      backgroundColor: t.colors.surface.card,
      marginBottom:  t.spacing.lg,
    },
    progressWrapper: {
      marginTop:    t.spacing.md,
      width:        '100%',
    },
    errorCard: {
      backgroundColor: t.colors.feedback.danger.bg,
      borderColor:     t.colors.feedback.danger.border,
      marginBottom:    t.spacing.md,
    },
    actionsGap: {
      gap: t.spacing.md,
    },
  }));

  // ── Pick + upload ──────────────────────────────────────────────────────────
  const handlePickFile = async () => {
    try {
      setUploadState('picking');
      setErrorMsg('');

      const [result] = await pick({
        type: [types.xlsx, types.xls],
        allowMultiSelection: false,
      });

      setUploadState('uploading');
      setProgress(0);

      const response = await uploadSchedule(
        {
          uri:  result.uri,
          name: result.name  ?? 'schedule.xlsx',
          type: result.type  ?? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          size: result.size  ?? undefined,
        },
        (pct) => setProgress(pct)
      );

      // Store in Redux
      dispatch(setBlocks([]));           // blocks will be fetched separately
      dispatch(setLastUploadedAt(new Date().toISOString()));

      setUploadState('success');
      setProgress(100);

      // Navigate after short delay
      setTimeout(() => {
        navigation?.replace('Main');
      }, 800);

    } catch (err: unknown) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        setUploadState('idle');
        return;
      }
      const message = err instanceof Error ? err.message : 'Upload failed';
      setErrorMsg(message);
      setUploadState('error');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadSampleTemplate();
    } catch {
      Alert.alert('Error', 'Could not open template URL');
    }
  };

  const isUploading = uploadState === 'uploading' || uploadState === 'picking';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText variant="display" color="brand">FOCUSDAY</ThemedText>
          <ThemedText variant="body" color="muted">Your daily execution engine</ThemedText>
        </View>

        {/* Upload card */}
        <ThemedCard noPadding style={styles.uploadCard}>
          <UploadIcon />
          <ThemedText variant="h2">Upload Schedule</ThemedText>
          <ThemedText variant="body" color="muted" style={{ textAlign: 'center', marginTop: 4 }}>
            Apni .xlsx file upload karo{'\n'}aur schedule auto-load hogi
          </ThemedText>

          {/* Progress bar while uploading */}
          {isUploading && (
            <View style={styles.progressWrapper}>
              <ProgressBar percent={progress} showLabel height={4} />
            </View>
          )}

          {/* Success message */}
          {uploadState === 'success' && (
            <ThemedText variant="caption" color="success" style={{ marginTop: 8 }}>
              ✓ Upload successful — loading schedule…
            </ThemedText>
          )}
        </ThemedCard>

        {/* Error state */}
        {uploadState === 'error' && (
          <ThemedCard style={styles.errorCard}>
            <ThemedText variant="caption" color="danger">{errorMsg}</ThemedText>
          </ThemedCard>
        )}

        {/* Actions */}
        <View style={styles.actionsGap}>
          <ThemedButton
            variant="primary"
            label={isUploading ? 'Uploading…' : 'Upload .xlsx File'}
            onPress={handlePickFile}
            loading={isUploading}
            size="lg"
          />

          <ThemedDivider label="ya pehle format dekho" />

          <ThemedButton
            variant="ghost"
            label="Download Sample Template"
            onPress={handleDownloadTemplate}
            size="lg"
          />
        </View>

        {/* Format rules */}
        <ThemedDivider spacing="lg" />
        <FormatRulesCard />

      </ScrollView>
    </SafeAreaView>
  );
};

export default UploadScreen;
